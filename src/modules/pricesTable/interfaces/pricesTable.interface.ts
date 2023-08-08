import { Document } from 'mongoose';
import { z } from 'nestjs-zod/z';
import { PricesTableModelSchema } from '../schemas/pricesTable.schema';

type schemaType = z.infer<typeof PricesTableModelSchema>;

export interface PricesTable extends schemaType, Document {}
