import { Document } from 'mongoose';
import { z } from 'nestjs-zod/z';
import { FeedStockSchema } from '../schemas/feedstock.schema';

type schemaType = z.infer<typeof FeedStockSchema>;

export interface FeedStock extends schemaType, Document {}
