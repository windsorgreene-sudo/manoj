import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.email("Enter a valid email"),
  subject: z.string().trim().min(3, "Add a subject").max(120),
  message: z.string().trim().min(20, "Tell us a bit more (20+ characters)").max(4000),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const contributorSchema = z.object({
  expertise: z.string().trim().min(3, "What topics can you write about?").max(200),
  sample: z.string().trim().min(200, "Paste a sample of at least 200 characters").max(20_000),
  portfolio: z.union([z.url("Enter a valid URL"), z.literal("")]).optional(),
});
export type ContributorInput = z.infer<typeof contributorSchema>;
