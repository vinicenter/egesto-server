import { Document } from 'mongoose';
import { z } from 'nestjs-zod/z';
import { FamilySchema } from '../schemas/families.schema';

type schemaType = z.infer<typeof FamilySchema>;

export interface Family extends schemaType, Document {}
