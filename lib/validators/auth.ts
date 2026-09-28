import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .max(128)
  .regex(/[A-Z]/, "Include an uppercase letter")
  .regex(/[0-9]/, "Include a number");

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(60),
  email: z.email("Enter a valid email"),
  password: passwordSchema,
});
export type SignupInput = z.infer<typeof signupSchema>;

export const forgotSchema = z.object({ email: z.email("Enter a valid email") });
export type ForgotInput = z.infer<typeof forgotSchema>;

export const resetSchema = z
  .object({ password: passwordSchema, confirm: z.string() })
  .refine((v) => v.password === v.confirm, { message: "Passwords do not match", path: ["confirm"] });
export type ResetInput = z.infer<typeof resetSchema>;
