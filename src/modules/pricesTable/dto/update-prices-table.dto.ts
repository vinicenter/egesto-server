import { createZodDto } from 'nestjs-zod';
import { PricesTableModelSchema } from '../schemas/pricesTable.schema';

const UpdateSchema = PricesTableModelSchema.partial().strip();

export class PricesTableUpdateDto extends createZodDto(UpdateSchema) {}
