import mongoose from 'mongoose';
import { z } from 'nestjs-zod/z';
import { toMongooseSchema } from 'mongoose-zod';
import { PaginatorSchema } from 'src/utils/paginator/paginator.schema';

export const FamilyPaginatorSchema = PaginatorSchema.and(
  z
    .object({
      familyType: z.enum(['main', 'linked', 'all']).optional(),
      mainFamily: z.string().optional(),
    })
    .optional(),
);

export const FamilySchema = z.object({
  externalId: z.string().optional(),
  name: z.string(),
  costs: z.array(
    z
      .object({
        name: z.string(),
        value: z.number(),
      })
      .optional(),
  ),
  linkedFamily: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val))
    .mongooseTypeOptions({ ref: 'FAMILY_MODEL' })
    .nullish(),
  deletedAt: z.string().optional(),
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
