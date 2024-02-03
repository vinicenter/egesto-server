import mongoose from 'mongoose';
import { z } from 'nestjs-zod/z';

export const CostsTableModelSchema = z.object({
  externalId: z.string().optional(),
  name: z.string(),
  defaultShipmentCost: z.number(),
  taxes: z.array(
    z
      .object({
        name: z.string(),
        cost: z.number(),
      })
      .optional(),
  ),
  shipments: z.object({
    products: z.array(
      z
        .object({
          product: z
            .string()
            .refine((val) => mongoose.Types.ObjectId.isValid(val))
            .mongooseTypeOptions({ ref: 'PRODUCT_MODEL' }),
          cost: z.number(),
        })
        .optional(),
    ),
    families: z.array(
      z
        .object({
          family: z
            .string()
            .refine((val) => mongoose.Types.ObjectId.isValid(val))
            .mongooseTypeOptions({ ref: 'FAMILY_MODEL' }),
          cost: z.number(),
        })
        .optional(),
    ),
  }),
  deletedAt: z.string().optional(),
});
