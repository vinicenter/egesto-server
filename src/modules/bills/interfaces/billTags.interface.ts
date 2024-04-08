import { Document } from 'mongoose';
import { z } from 'nestjs-zod/z';
import { BillTagschema } from '../schemas/billTags.schema';

type schemaType = z.infer<typeof BillTagschema>;

export interface BillTag extends schemaType, Document {}
