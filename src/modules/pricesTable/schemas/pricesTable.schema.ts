import mongoose from 'mongoose';
import { z } from 'nestjs-zod/z';

export const PricesTableModelSchema = z.object({
  archived: z.boolean(),
  costTable: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val))
    .mongooseTypeOptions({ ref: 'COSTS_TABLE_MODEL' }),
  customer: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val))
    .mongooseTypeOptions({ ref: 'PEOPLE_MODEL' })
    .nullish(),
  name: z.string(),
  prices: z
    .array(
      z.object({
        product: z
          .string()
          .refine((val) => mongoose.Types.ObjectId.isValid(val))
          .mongooseTypeOptions({ ref: 'PRODUCT_MODEL' }),
        productCost: z.number(),
        price: z.number(),
        volume: z.number(),
        netSales: z.number(),
        grossRevenue: z.number(),
        shipment: z.number(),
        expense: z.number(),
        tax: z.number(),
        productionLost: z.number(),
        margin: z.number(),
      }),
    )
    .optional(),
});
