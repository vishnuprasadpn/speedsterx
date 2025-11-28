import { z } from "zod";

// Email validation schema
export const emailSchema = z.string().email("Invalid email format");

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

// User registration schema
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: emailSchema,
  password: passwordSchema,
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .optional()
    .or(z.literal(""))
    .or(z.undefined()),
});

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

// Product ID schema
export const productIdSchema = z.string().cuid();

// Quantity schema
export const quantitySchema = z.number().int().min(1).max(100);

// Cart item schema
export const cartItemSchema = z.object({
  productId: productIdSchema,
  quantity: quantitySchema,
});

// Address schema
export const addressSchema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  line1: z.string().min(5).max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  postalCode: z.string().regex(/^\d{5,6}$/),
  country: z.string().default("India"),
  isDefault: z.boolean().optional(),
});

// Sanitize string to prevent XSS
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove < and >
    .trim()
    .slice(0, 10000); // Limit length
}

// Validate and sanitize email
export function validateEmail(email: string): boolean {
  return emailSchema.safeParse(email).success;
}

