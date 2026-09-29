"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, MailCheck } from "lucide-react";
import { Field } from "@/components/auth/field";
import { SocialButtons } from "@/components/auth/social-buttons";
import { RippleButton } from "@/components/motion/ripple-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authClient } from "@/lib/auth-client";
import { signupSchema, type SignupInput } from "@/lib/validators/auth";

export function SignupForm({ next, google, github }: { next: string; google: boolean; github: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (values: SignupInput) => {
    setError(null);
    const { error: err } = await authClient.signUp.email({ ...values, callbackURL: "/verify-email" });
    if (err) {
      setError(err.status === 429 ? "Too many sign-up attempts. Try again shortly." : (err.message ?? "Could not create your account"));
      return;
    }
    setSentTo(values.email);
  };

  return (
    <AnimatePresence mode="wait">
      {sentTo ? (
        <motion.div key="sent" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="glass space-y-4 p-8 text-center">
          <MailCheck className="mx-auto size-12 text-success" />
          <h1 className="font-heading text-2xl font-bold">Check your inbox</h1>
          <p className="text-muted-foreground">
            We sent a verification link to <strong className="text-foreground">{sentTo}</strong>. Click it to activate your account.
          </p>
          <p className="text-xs text-muted-foreground">No email service configured? The link is printed in the server console.</p>
          <Link href="/login" className="inline-block text-sm font-medium underline-offset-4 hover:underline">
            Back to login
          </Link>
        </motion.div>
      ) : (
        <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-6">
          <div className="space-y-2">
            <h1 className="font-heading text-3xl font-bold">Create your account</h1>
            <p className="text-muted-foreground">100% free. No credit card, ever.</p>
          </div>
          <SocialButtons google={google} github={github} next={next} />
          {error ? (
            <Alert variant="destructive" className="rounded-xl">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Field id="name" label="Full name" autoComplete="name" placeholder="Aarav Sharma" error={errors.name?.message} {...register("name")} />
            <Field id="email" label="Email" type="email" autoComplete="email" placeholder="you@college.edu" error={errors.email?.message} {...register("email")} />
            <Field
              id="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder="8+ chars, 1 uppercase, 1 number"
              error={errors.password?.message}
              {...register("password")}
            />
            <RippleButton type="submit" className="h-11 w-full rounded-xl" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : null} Create account
            </RippleButton>
          </form>
          <p className="text-center text-xs text-muted-foreground">
            By signing up you agree to our{" "}
            <Link href="/terms" className="underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
              Log in
            </Link>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
