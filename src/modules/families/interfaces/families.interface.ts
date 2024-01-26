import { Document } from 'mongoose';
import { z } from 'nestjs-zod/z';
import { FamilySchema } from '../schemas/families.schema';
import { FamilyDefaultCostSchema } from '../schemas/familiesDefaultCost.model';

type FamilySchemaType = z.infer<typeof FamilySchema>;
export interface Family extends FamilySchemaType, Document {}

type FamilyDefaultCostType = z.infer<typeof FamilyDefaultCostSchema>;
export interface FamiliesDefaultCost extends FamilyDefaultCostType, Document {}
