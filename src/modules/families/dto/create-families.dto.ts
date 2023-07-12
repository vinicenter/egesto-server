import { createZodDto } from 'nestjs-zod';
import { FamilySchema } from '../schemas/families.schema';

export class FamilyDto extends createZodDto(FamilySchema) {}
