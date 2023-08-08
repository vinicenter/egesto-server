import { toMongooseSchema } from 'mongoose-zod';
import mongoose from 'mongoose';
import { PricesTableModelSchema } from '../schemas/pricesTable.schema';

const PricesTableSchemaZodMongoose = PricesTableModelSchema.mongoose({
  schemaOptions: {
    collection: 'prices-table',
    timestamps: true,
  },
});

export const PricesTableMongooseSchema = toMongooseSchema(
  PricesTableSchemaZodMongoose,
);

// PricesTableMongooseSchema.set('toObject', { virtuals: true });
// PricesTableMongooseSchema.set('toJSON', { virtuals: true });

// eslint-disable-next-line @typescript-eslint/no-var-requires
PricesTableMongooseSchema.plugin(require('mongoose-paginate-v2'));

export const PricesTableModel = mongoose.model(
  'PRICES_TABLE_MODEL',
  PricesTableMongooseSchema,
);
