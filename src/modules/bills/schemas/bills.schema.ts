import mongoose from 'mongoose';
import { z } from 'nestjs-zod/z';
import { toMongooseSchema } from 'mongoose-zod';
import { PaginatorSchema } from 'src/utils/paginator/paginator.schema';

export const billPaymentMethodSchema = z.enum([
  'BOLETO',
  'CHEQUE',
  'PIX',
  'TRANSFERENCIA_BANCARIA',
  'DINHEIRO',
]);

export const BillFilters = z.object({
  recipient: z.string().optional(),
  installment: z.string().optional(),
  paymentMethod: z.array(billPaymentMethodSchema).optional(),
  tags: z.array(z.string()).optional(),
  tagsFilterType: z.enum(['AND', 'OR']).default('OR'),
  isPaid: z
    .string()
    .default('false')
    .transform((value) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return undefined;
    }),
});

export const BillPaginatorSchema = PaginatorSchema.and(
  z.object({
    startDueDate: z.string().optional(),
    endDueDate: z.string().optional(),
  }),
).and(BillFilters);

export const BillCumulativeReportSchema = z
  .object({
    startDate: z.string(),
    endDate: z.string(),
  })
  .and(BillFilters);

export const BillSchema = z.object({
  dueDate: z.string(),
  recipient: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val))
    .mongooseTypeOptions({ ref: 'PEOPLE_MODEL' })
    .nullish(),
  paymentMethod: billPaymentMethodSchema,
  reference: z.string().optional(),
  tags: z
    .array(
      z
        .string()
        .refine((val) => mongoose.Types.ObjectId.isValid(val))
        .mongooseTypeOptions({ ref: 'BILL_TAG_MODEL' })
        .nullish(),
    )
    .optional(),
  installment: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val))
    .mongooseTypeOptions({ ref: 'BILL_INSTALLMENT_MODEL' })
    .nullish(),
  amount: z.number(),
  observations: z.string().optional(),
  isPaid: z.boolean(),
  deletedAt: z.string().optional(),
});

const BillSchemaZodMongoose = BillSchema.mongoose({
  schemaOptions: { collection: 'bills', timestamps: true },
});

export const BillMongooseSchema = toMongooseSchema(BillSchemaZodMongoose);

// eslint-disable-next-line @typescript-eslint/no-var-requires
BillMongooseSchema.plugin(require('mongoose-paginate-v2'));

export const BillModel = mongoose.model('BILL_MODEL', BillMongooseSchema);
