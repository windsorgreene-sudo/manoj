"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Field } from "@/components/auth/field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RippleButton } from "@/components/motion/ripple-button";
import { contactSchema, type ContactInput } from "@/lib/validators/marketing";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (values: ContactInput) => {
    const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    if (res.ok) {
      toast.success("Thanks! We'll get back to you within 2 working days.");
      reset();
    } else toast.error(res.status === 429 ? "Too many messages — try again later." : "Could not send your message.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass space-y-4 p-6 md:p-8" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="c-name" label="Name" autoComplete="name" error={errors.name?.message} {...register("name")} />
        <Field id="c-email" label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      </div>
      <Field id="c-subject" label="Subject" error={errors.subject?.message} {...register("subject")} />
      <div className="space-y-2">
        <Label htmlFor="c-message">Message</Label>
        <Textarea id="c-message" rows={6} className="rounded-xl" aria-invalid={Boolean(errors.message)} {...register("message")} />
        {errors.message ? (
          <p role="alert" className="text-xs text-danger">
            {errors.message.message}
          </p>
        ) : null}
      </div>
      <RippleButton type="submit" className="h-11 w-full rounded-xl" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />} Send message
      </RippleButton>
    </form>
  );
}
