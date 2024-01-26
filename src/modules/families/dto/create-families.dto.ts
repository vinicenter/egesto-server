import { createZodDto } from 'nestjs-zod';
import { FamilySchema } from '../schemas/families.schema';
import { FamilyDefaultCostSchema } from '../schemas/familiesDefaultCost.model';

export class FamilyDto extends createZodDto(FamilySchema) {}
export class FamilyDefaultCostDto extends createZodDto(
  FamilyDefaultCostSchema,
) {}
