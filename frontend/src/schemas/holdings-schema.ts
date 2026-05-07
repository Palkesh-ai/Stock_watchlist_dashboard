import { z } from "zod";

export const addHoldingSchema = z.object({
  symbol: z.string().min(1, "Symbol is required").toUpperCase(),
  companyName: z.string().optional(),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  averagePrice: z.coerce.number().min(0.01, "Average price must be greater than 0")
});

export type AddHoldingSchema = z.infer<typeof addHoldingSchema>;
