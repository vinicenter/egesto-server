import mongoose from 'mongoose';
import { z } from 'nestjs-zod/z';
import { toMongooseSchema } from 'mongoose-zod';

export const FeedStockSchema = z.object({
  externalId: z.string().optional(),
  name: z.string(),
  price: z.number(),
  icms: z.number(),
  ncm: z.string().optional(),
  brand: z
    .string()
    .refine((val) => {
      return mongoose.Types.ObjectId.isValid(val);
    })
    .mongooseTypeOptions({
      ref: 'BRAND_MODEL',
    })
    .nullish(),
  deletedAt: z.string().optional(),
});

const FeedStockSchemaZodMongoose = FeedStockSchema.mongoose({
  schemaOptions: { collection: 'feedstocks', timestamps: true },
});

export const FeedStockMongooseSchema = toMongooseSchema(
  FeedStockSchemaZodMongoose,
);

FeedStockMongooseSchema.virtual('priceWithoutIcms').get(function () {
  return this.price * (1 - this.icms / 100);
});

FeedStockMongooseSchema.set('toJSON', { virtuals: true });
FeedStockMongooseSchema.set('toObject', { virtuals: true });

// eslint-disable-next-line @typescript-eslint/no-var-requires
FeedStockMongooseSchema.plugin(require('mongoose-paginate-v2'));

export const FeedStockModel = mongoose.model(
  'FEEDSTOCK_MODEL',
  FeedStockMongooseSchema,
);
