import { createZodDto } from 'nestjs-zod';
import { PricesTablePaginatorSchema } from '../schemas/pricesTable.schema';

export class PricesTablePaginateDto extends createZodDto(
  PricesTablePaginatorSchema,
) {}
