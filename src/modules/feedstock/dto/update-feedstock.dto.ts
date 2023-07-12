import { createZodDto } from 'nestjs-zod';
import { FeedStockSchema } from '../schemas/feedstock.schema';

const updateFeedStockSchema = FeedStockSchema.partial().strip();

export class UpdateFeedStockDto extends createZodDto(updateFeedStockSchema) {}
