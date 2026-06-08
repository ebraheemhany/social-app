import { z } from "zod";

export const signUpSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" }),

    email: z.string().email({ message: "Invalid email address" }),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/, {
        message:
          "Password must include uppercase, lowercase, number, and special character",
      }),

    restpassword: z
      .string()
      .min(8, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.restpassword, {
    message: "Passwords do not match",
    path: ["restpassword"],
  });

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type SignUpData = z.infer<typeof signUpSchema>;
export type SignInData = z.infer<typeof signInSchema>;
