import { z } from "zod";

export const SignupSchema = z.object({
  username: z.string().min(5, { message: "Minimum 5 characters" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email" }),
  phone: z.int().min(10).max(10),
  password: z.string().min(5, { message: "Minimum 5 characters" }),
});

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email" }),
  password: z.string().min(5, { message: "Minimum 5 characters" }),
});

export const PaymentSchema = z.object({
  token: z.string().min(10),
  userId: z.string(),
  amount: z.number().positive(),
  status: z.string(),
});

export const IdSchema = z.string();

export type SignUpInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type IdInput = z.infer<typeof IdSchema>;
