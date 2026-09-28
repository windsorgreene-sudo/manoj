"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Field } from "@/components/auth/field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RippleButton } from "@/components/motion/ripple-button";
import { contributorSchema, type ContributorInput } from "@/lib/validators/marketing";
import { applyAsContributor } from "@/lib/actions/marketing";

export function ContributorForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContributorInput>({ resolver: zodResolver(contributorSchema) });

  const onSubmit = async (values: ContributorInput) => {
    const res = await applyAsContributor(values);
    if (res.ok) {
      toast.success("Application submitted! We'll be in touch soon.");
      router.refresh();
    } else toast.error(res.error);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass space-y-4 p-6 md:p-8" noValidate>
      <h2 className="text-xl font-semibold">Apply as a contributor</h2>
      <Field id="expertise" label="Topics you can write about" placeholder="e.g. Graph algorithms, Java, DBMS" error={errors.expertise?.message} {...register("expertise")} />
      <Field id="portfolio" label="Portfolio / blog / GitHub (optional)" placeholder="https://" error={errors.portfolio?.message} {...register("portfolio")} />
      <div className="space-y-2">
        <Label htmlFor="sample">Writing sample (Markdown welcome)</Label>
        <Textarea id="sample" rows={10} className="rounded-xl font-mono text-sm" aria-invalid={Boolean(errors.sample)} {...register("sample")} />
        {errors.sample ? (
          <p role="alert" className="text-xs text-danger">
            {errors.sample.message}
          </p>
        ) : null}
      </div>
      <RippleButton type="submit" className="h-11 w-full rounded-xl" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : null} Submit application
      </RippleButton>
    </form>
  );
}
