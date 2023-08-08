import { createZodDto } from 'nestjs-zod';
import { PricesTableModelSchema } from '../schemas/pricesTable.schema';

export class PricesTableDto extends createZodDto(PricesTableModelSchema) {}
