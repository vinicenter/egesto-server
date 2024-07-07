import { Document } from 'mongoose';
import { z } from 'nestjs-zod/z';
import { BillInstallmentSchema } from '../schemas/billInstallment.schema';

type schemaType = z.infer<typeof BillInstallmentSchema>;

export interface BillInstallment extends schemaType, Document {}
