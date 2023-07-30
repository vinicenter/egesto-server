import { Document } from 'mongoose';
import { z } from 'nestjs-zod/z';
import { CostsTableModelSchema } from '../schemas/costsTable.schema';

type schemaType = z.infer<typeof CostsTableModelSchema>;

export interface CostsTable extends schemaType, Document {}
