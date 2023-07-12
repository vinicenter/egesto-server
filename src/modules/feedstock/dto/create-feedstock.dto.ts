import { createZodDto } from 'nestjs-zod';
import { FeedStockSchema } from '../schemas/feedstock.schema';

export class CreateFeedStockDto extends createZodDto(FeedStockSchema) {}
