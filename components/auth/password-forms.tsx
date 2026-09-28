"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { Field } from "@/components/auth/field";
import { RippleButton } from "@/components/motion/ripple-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authClient } from "@/lib/auth-client";
import { forgotSchema, resetSchema, type ForgotInput, type ResetInput } from "@/lib/validators/auth";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotInput>({ resolver: zodResolver(forgotSchema) });

  const onSubmit = async ({ email }: ForgotInput) => {
    const { error } = await authClient.requestPasswordReset({ email, redirectTo: "/reset-password" });
    if (error && error.status === 429) {
      toast.error("Too many requests. Try again in a few minutes.");
      return;
    }
    // Always show success to avoid leaking which emails exist.
    setSent(true);
  };

  if (sent)
    return (
      <div className="glass space-y-4 p-8 text-center">
        <MailCheck className="mx-auto size-12 text-success" />
        <h1 className="font-heading text-2xl font-bold">Check your email</h1>
        <p className="text-muted-foreground">If an account exists for that address, a reset link is on its way.</p>
        <Link href="/login" className="text-sm underline">
          Back to login
        </Link>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-bold">Forgot password?</h1>
        <p className="text-muted-foreground">Enter your email and we&apos;ll send you a reset link.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Field id="email" label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
        <RippleButton type="submit" className="h-11 w-full rounded-xl" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : null} Send reset link
        </RippleButton>
      </form>
      <p className="text-center text-sm">
        <Link href="/login" className="text-muted-foreground hover:text-foreground">
          ← Back to login
        </Link>
      </p>
    </div>
  );
}

export function ResetPasswordForm({ token, invalid }: { token: string | null; invalid: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(invalid || !token ? "This reset link is invalid or has expired." : null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetInput>({ resolver: zodResolver(resetSchema) });

  const onSubmit = async ({ password }: ResetInput) => {
    if (!token) return;
    const { error: err } = await authClient.resetPassword({ newPassword: password, token });
    if (err) {
      setError(err.message ?? "Could not reset password");
      return;
    }
    toast.success("Password updated — please log in.");
    router.push("/login");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-bold">Choose a new password</h1>
        <p className="text-muted-foreground">Make it strong — at least 8 characters with a number and an uppercase letter.</p>
      </div>
      {error ? (
        <Alert variant="destructive" className="rounded-xl">
          <AlertDescription>
            {error}{" "}
            <Link href="/forgot-password" className="underline">
              Request a new link
            </Link>
          </AlertDescription>
        </Alert>
      ) : null}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Field id="password" label="New password" type="password" autoComplete="new-password" error={errors.password?.message} {...register("password")} />
        <Field id="confirm" label="Confirm password" type="password" autoComplete="new-password" error={errors.confirm?.message} {...register("confirm")} />
        <RippleButton type="submit" className="h-11 w-full rounded-xl" disabled={isSubmitting || !token}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : null} Update password
        </RippleButton>
      </form>
    </div>
  );
}
