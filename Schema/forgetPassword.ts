// Schema/forgetPassword.ts
import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const resetPasswordSchema = z.object({
  newPassword:z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/, {
        message:
          "Password must include uppercase, lowercase, number, and special character",
      }),

    confirmPassword: z
      .string()
      .min(8, { message: "Confirm password is required" }),
 
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type EmailData = z.infer<typeof emailSchema>;
export type OtpData = z.infer<typeof otpSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;