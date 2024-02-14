import { createZodDto } from 'nestjs-zod';
import {
  FamilyPaginatorSchema,
  FamilySchema,
} from '../schemas/families.schema';
import { FamilyDefaultCostSchema } from '../schemas/familiesDefaultCost.model';

export class FamilyPaginateDto extends createZodDto(FamilyPaginatorSchema) {}

export class FamilyDto extends createZodDto(FamilySchema) {}
export class FamilyDefaultCostDto extends createZodDto(
  FamilyDefaultCostSchema,
) {}
