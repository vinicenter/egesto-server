import { createZodDto } from 'nestjs-zod';
import { FeedStockSchema } from '../schemas/feedstock.schema';

export class FeedStockDto extends createZodDto(FeedStockSchema) {}
