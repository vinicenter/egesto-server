import mongoose from 'mongoose';
import { z } from 'nestjs-zod/z';
import { toMongooseSchema } from 'mongoose-zod';

export const BrandSchema = z.object({
  externalId: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
});

const BrandSchemaZodMongoose = BrandSchema.mongoose({
  schemaOptions: { collection: 'brands', timestamps: true },
});

export const BrandMongooseSchema = toMongooseSchema(BrandSchemaZodMongoose);

// eslint-disable-next-line @typescript-eslint/no-var-requires
BrandMongooseSchema.plugin(require('mongoose-paginate-v2'));

export const BrandModel = mongoose.model('BRAND_MODEL', BrandMongooseSchema);
