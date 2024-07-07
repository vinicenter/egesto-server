import mongoose from 'mongoose';
import { z } from 'nestjs-zod/z';
import { toMongooseSchema } from 'mongoose-zod';
import { billPaymentMethodSchema } from './bills.schema';

export const BillInstallmentCreate = z.object({
  name: z.string(),
  recipient: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val))
    .mongooseTypeOptions({ ref: 'PEOPLE_MODEL' })
    .nullish(),
  paymentMethod: billPaymentMethodSchema,
  observations: z.string().optional(),
  tags: z
    .array(
      z
        .string()
        .refine((val) => mongoose.Types.ObjectId.isValid(val))
        .mongooseTypeOptions({ ref: 'BILL_TAG_MODEL' })
        .nullish(),
    )
    .optional(),
  bills: z.array(
    z.object({
      _id: z.string().optional(),
      isPaid: z.boolean(),
      dueDate: z.string(),
      amount: z.number(),
      reference: z.string().optional(),
    }),
  ),
});

export const BillInstallmentSchema = z.object({
  name: z.string(),
  observations: z.string().optional(),
  paymentMethod: billPaymentMethodSchema,
  recipient: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val))
    .mongooseTypeOptions({ ref: 'PEOPLE_MODEL' })
    .nullish(),
  tags: z
    .array(
      z
        .string()
        .refine((val) => mongoose.Types.ObjectId.isValid(val))
        .mongooseTypeOptions({ ref: 'BILL_TAG_MODEL' })
        .nullish(),
    )
    .optional(),
  deletedAt: z.string().optional(),
});

const BillInstallmentSchemaZodMongoose = BillInstallmentSchema.mongoose({
  schemaOptions: { collection: 'bills-installments', timestamps: true },
});

export const BillInstallmentMongooseSchema = toMongooseSchema(
  BillInstallmentSchemaZodMongoose,
);

// eslint-disable-next-line @typescript-eslint/no-var-requires
BillInstallmentMongooseSchema.plugin(require('mongoose-paginate-v2'));

export const BillInstallmentModel = mongoose.model(
  'BILL_INSTALLMENT_MODEL',
  BillInstallmentMongooseSchema,
);
