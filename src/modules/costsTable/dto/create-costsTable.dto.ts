import { createZodDto } from 'nestjs-zod';
import { CostsTableModelSchema } from '../schemas/costsTable.schema';

export class CostsTableDto extends createZodDto(CostsTableModelSchema) {}
