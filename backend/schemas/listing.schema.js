import { z } from 'zod';

export const createListingSchema = z.object({
  body: z.object({
    title: z.string()
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title cannot exceed 100 characters"),
    description: z.string()
      .min(20, "Description requires at least 20 characters")
      .max(2000, "Description cannot exceed 2000 characters"),
    price: z.number().min(0, "Price cannot be negative").optional().or(z.literal('')),
    isNegotiable: z.boolean().default(false),
    propertyType: z.enum(["House", "Apartment", "Commercial", "Land"]),
    status: z.enum(["Available", "Sold", "Rented"]).default("Available"), address: z.string()
      .min(5, "Valid address required")
      .max(200, "Address cannot exceed 200 characters"),
  })
});