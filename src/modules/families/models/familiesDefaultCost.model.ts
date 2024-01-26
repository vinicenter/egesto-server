import { toMongooseSchema } from 'mongoose-zod';
import mongoose from 'mongoose';
import { FamilyDefaultCostSchema } from '../schemas/familiesDefaultCost.model';

const FamilyDefaultCostSchemaZodMongoose = FamilyDefaultCostSchema.mongoose({
  schemaOptions: {
    collection: 'families-default-cost',
    timestamps: true,
  },
});

export const FamilyDefaultCostMongooseSchema = toMongooseSchema(
  FamilyDefaultCostSchemaZodMongoose,
);

FamilyDefaultCostMongooseSchema.virtual('totalCosts').get(function () {
  return this.costs.reduce((acc, cost) => acc + cost.value, 0);
});

FamilyDefaultCostMongooseSchema.set('toObject', { virtuals: true });
FamilyDefaultCostMongooseSchema.set('toJSON', { virtuals: true });

export const FamilyDefaultCostModel = mongoose.model(
  'FAMILIES_DEFAULT_COST_MODEL',
  FamilyDefaultCostMongooseSchema,
);
