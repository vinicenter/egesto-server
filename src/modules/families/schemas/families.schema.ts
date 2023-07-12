import mongoose from 'mongoose';
import { z } from 'nestjs-zod/z';
import { toMongooseSchema } from 'mongoose-zod';

export const FamilySchema = z.object({
  name: z.string(),
  costs: z.array(
    z
      .object({
        name: z.string(),
        value: z.number(),
      })
      .optional(),
  ),
});

const FamilySchemaZodMongoose = FamilySchema.mongoose({
  schemaOptions: { collection: 'families', timestamps: true },
});

export const FamilyMongooseSchema = toMongooseSchema(FamilySchemaZodMongoose);

FamilyMongooseSchema.virtual('totalCosts').get(function () {
  return this.costs.reduce((acc, cost) => acc + cost.value, 0);
});

FamilyMongooseSchema.set('toJSON', { virtuals: true });

// eslint-disable-next-line @typescript-eslint/no-var-requires
FamilyMongooseSchema.plugin(require('mongoose-paginate-v2'));

export const FamilyModel = mongoose.model('FAMILY_MODEL', FamilyMongooseSchema);
