import { toMongooseSchema } from 'mongoose-zod';
import mongoose from 'mongoose';
import { CostsTableModelSchema } from '../schemas/costsTable.schema';

const CostsTableSchemaZodMongoose = CostsTableModelSchema.mongoose({
  schemaOptions: {
    collection: 'costs-table',
    timestamps: true,
  },
});

export const CostsTableMongooseSchema = toMongooseSchema(
  CostsTableSchemaZodMongoose,
);

CostsTableMongooseSchema.virtual('totalTaxes').get(function () {
  return this.taxes.reduce((acc, tax) => acc + tax.cost, 0);
});

CostsTableMongooseSchema.set('toObject', { virtuals: true });
CostsTableMongooseSchema.set('toJSON', { virtuals: true });

// eslint-disable-next-line @typescript-eslint/no-var-requires
CostsTableMongooseSchema.plugin(require('mongoose-paginate-v2'));

export const CostsTableModel = mongoose.model(
  'COSTS_TABLE_MODEL',
  CostsTableMongooseSchema,
);
