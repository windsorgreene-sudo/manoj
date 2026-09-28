"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Field } from "@/components/auth/field";
import { SocialButtons } from "@/components/auth/social-buttons";
import { RippleButton } from "@/components/motion/ripple-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { loginSchema, type LoginInput } from "@/lib/validators/auth";

export function LoginForm({ next, google, github }: { next: string; google: boolean; github: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [unverified, setUnverified] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginInput) => {
    setError(null);
    setUnverified(null);
    const { error: err } = await authClient.signIn.email({ ...values, callbackURL: next });
    if (err) {
      if (err.status === 403 && /verif/i.test(err.message ?? "")) {
        setUnverified(values.email);
        return;
      }
      setError(err.status === 429 ? "Too many attempts. Please wait a minute and try again." : (err.message ?? "Invalid email or password"));
      return;
    }
    toast.success("Welcome back!");
    router.push(next);
    router.refresh();
  };

  const resend = async () => {
    if (!unverified) return;
    const { error: err } = await authClient.sendVerificationEmail({ email: unverified, callbackURL: "/verify-email" });
    if (err) toast.error(err.message ?? "Could not resend");
    else toast.success("Verification email sent — check your inbox.");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">Log in to continue your streak.</p>
      </div>
      <SocialButtons google={google} github={github} next={next} />
      {error ? (
        <Alert variant="destructive" className="rounded-xl">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {unverified ? (
        <Alert className="rounded-xl">
          <AlertDescription className="flex flex-wrap items-center gap-2">
            Please verify your email first.
            <Button variant="link" className="h-auto p-0" onClick={resend}>
              Resend verification email
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Field id="email" label="Email" type="email" autoComplete="email" placeholder="you@college.edu" error={errors.email?.message} {...register("email")} />
        <div className="space-y-2">
          <Field
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
          <div className="text-right">
            <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">
              Forgot password?
            </Link>
          </div>
        </div>
        <RippleButton type="submit" className="h-11 w-full rounded-xl" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : null} Log in
        </RippleButton>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        New to CodeVerse?{" "}
        <Link href={`/signup${next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-medium text-foreground underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
      <div className="glass p-4 text-xs text-muted-foreground">
        <p className="mb-1 font-semibold text-foreground">Demo accounts</p>
        <p>Student: student@codeverse.dev / Student@123</p>
        <p>Admin: admin@codeverse.dev / Admin@123</p>
      </div>
    </motion.div>
  );
}
