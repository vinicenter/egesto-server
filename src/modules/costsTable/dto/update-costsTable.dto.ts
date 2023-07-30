import { createZodDto } from 'nestjs-zod';
import { CostsTableModelSchema } from '../schemas/costsTable.schema';

const CostsTableUpdateSchema = CostsTableModelSchema.partial().strip();

export class CostsTableUpdateDto extends createZodDto(CostsTableUpdateSchema) {}
