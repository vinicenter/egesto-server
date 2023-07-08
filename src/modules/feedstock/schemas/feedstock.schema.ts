import mongoose from 'mongoose';
import { z } from 'nestjs-zod/z';
import { toMongooseSchema } from 'mongoose-zod';

export const FeedStockSchema = z.object({
  name: z.string(),
  price: z.number(),
  icms: z.number(),
  priceWithoutIcms: z.number(),
  ncm: z.string().optional(),
  brand: z
    .string()
    .refine((val) => {
      return mongoose.Types.ObjectId.isValid(val);
    })
    .mongooseTypeOptions({
      ref: 'BRAND_MODEL',
    })
    .optional(),
});

const FeedStockSchemaZodMongoose = FeedStockSchema.mongoose({
  schemaOptions: { collection: 'feedstocks', timestamps: true },
});

export const FeedStockMongooseSchema = toMongooseSchema(
  FeedStockSchemaZodMongoose,
);

// eslint-disable-next-line @typescript-eslint/no-var-requires
FeedStockMongooseSchema.plugin(require('mongoose-paginate-v2'));

export const FeedStockModel = mongoose.model(
  'FEEDSTOCK_MODEL',
  FeedStockMongooseSchema,
);
