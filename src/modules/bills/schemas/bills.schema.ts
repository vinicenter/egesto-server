import mongoose from 'mongoose';
import { z } from 'nestjs-zod/z';
import { toMongooseSchema } from 'mongoose-zod';
import { PaginatorSchema } from 'src/utils/paginator/paginator.schema';

const billPaymentMethodSchema = z.enum([
  'BOLETO',
  'CHEQUE',
  'PIX',
  'TRANSFERENCIA_BANCARIA',
  'DINHEIRO',
]);

export const BillPaginatorSchema = PaginatorSchema.and(
  z.object({
    startDueDate: z.string().optional(),
    endDueDate: z.string().optional(),
    recipient: z.string().optional(),
    paymentMethod: billPaymentMethodSchema.optional(),
    isPaid: z
      .string()
      .default('false')
      .transform((value) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return undefined;
      }),
  }),
);

export const BillCumulativeReportSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  isPaid: z
    .string()
    .default('false')
    .transform((value) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return undefined;
    }),
});

export const BillSchema = z.object({
  dueDate: z.string(),
  recipient: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val))
    .mongooseTypeOptions({ ref: 'PEOPLE_MODEL' })
    .nullish(),
  paymentMethod: billPaymentMethodSchema,
  reference: z.string().optional(),
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
