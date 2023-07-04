import { Document } from 'mongoose';
import { z } from 'nestjs-zod/z';
import { BrandSchema } from '../schemas/brand.schema';

type schemaType = z.infer<typeof BrandSchema>;

export interface Brand extends schemaType, Document {}
