import { z } from "zod";

export const SignUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(4),
});
export const addAddressSchema = z.object({
  lineOne: z.string(),
  lineTwo: z.string().nullable(),
  city: z.string(),
  country: z.string(),
  pincode: z.string().length(6),
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  defaultShippingAddress: z.number().optional(),
  defaultBillingAddress: z.number().optional(),
});
