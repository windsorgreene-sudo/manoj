import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { APIError } from "better-auth/api";
import { db } from "@/lib/db";
import { emailLayout, sendEmail } from "@/lib/email";
import { integrations } from "@/lib/env";
import { appUrl } from "@/lib/utils";

const socialProviders: Parameters<typeof betterAuth>[0]["socialProviders"] = {};
if (integrations.google()) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  };
}
if (integrations.github()) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  };
}

function baseUsername(email: string) {
  return email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20) || "coder";
}

export const auth = betterAuth({
  appName: "Kodshala",
  baseURL: process.env.BETTER_AUTH_URL || appUrl(),
  secret: process.env.BETTER_AUTH_SECRET,
  // Production URL plus this deployment's own Vercel URLs (so preview deployments can log in too).
  trustedOrigins: [appUrl(), process.env.BETTER_AUTH_URL, process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`, process.env.VERCEL_BRANCH_URL && `https://${process.env.VERCEL_BRANCH_URL}`].filter((o): o is string => Boolean(o)),
  database: prismaAdapter(db, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your Kodshala password",
        html: emailLayout("Reset your password", "Click the button below to choose a new password. This link expires in 1 hour.", {
          label: "Reset password",
          url,
        }),
        text: `Reset your password: ${url}`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your Kodshala email",
        html: emailLayout("Welcome to Kodshala", "Confirm your email to start learning, practicing and competing.", {
          label: "Verify email",
          url,
        }),
        text: `Verify your email: ${url}`,
      });
    },
  },
  socialProviders,
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "STUDENT", input: false },
      username: { type: "string", required: false, input: false },
      banned: { type: "boolean", defaultValue: false, input: false },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    customRules: {
      // Reading the session is harmless and happens on every page view; never throttle it.
      "/get-session": false,
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 60, max: 3 },
      "/request-password-reset": { window: 300, max: 3 },
      "/send-verification-email": { window: 300, max: 3 },
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    defaultCookieAttributes: { httpOnly: true, sameSite: "lax" },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          let username = baseUsername(user.email);
          const taken = await db.user.findUnique({ where: { username }, select: { id: true } });
          if (taken && taken.id !== user.id) username = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
          await db.user.update({ where: { id: user.id }, data: { username } });
          await db.profile.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id } });
          await db.streak.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id } });
          await db.notification.create({
            data: {
              userId: user.id,
              type: "SYSTEM",
              title: "Welcome to Kodshala!",
              body: "Start with the DSA course or solve today's Problem of the Day to begin your streak.",
              link: "/dashboard",
            },
          });
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const u = await db.user.findUnique({ where: { id: session.userId }, select: { banned: true, banExpires: true } });
          if (u?.banned && (!u.banExpires || u.banExpires > new Date())) {
            throw new APIError("FORBIDDEN", { message: "Your account has been suspended. Contact support@kodshala.com." });
          }
        },
      },
    },
  },
  plugins: [nextCookies()],
});

export type AuthSession = typeof auth.$Infer.Session;
