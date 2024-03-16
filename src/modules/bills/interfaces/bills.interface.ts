import { Document } from 'mongoose';
import { z } from 'nestjs-zod/z';
import { BillSchema } from '../schemas/bills.schema';

type schemaType = z.infer<typeof BillSchema>;

export interface Bill extends schemaType, Document {}
