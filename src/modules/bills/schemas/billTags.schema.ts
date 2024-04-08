import mongoose from 'mongoose';
import { z } from 'nestjs-zod/z';
import { toMongooseSchema } from 'mongoose-zod';

export const BillTagschema = z.object({
  name: z.string(),
  description: z.string().optional(),
  color: z.string(),
  deletedAt: z.string().optional(),
});

const BillTagschemaZodMongoose = BillTagschema.mongoose({
  schemaOptions: { collection: 'bills-tags', timestamps: true },
});

export const BillTagMongooseSchema = toMongooseSchema(BillTagschemaZodMongoose);

// eslint-disable-next-line @typescript-eslint/no-var-requires
BillTagMongooseSchema.plugin(require('mongoose-paginate-v2'));

export const BillTagModel = mongoose.model(
  'BILL_TAG_MODEL',
  BillTagMongooseSchema,
);
