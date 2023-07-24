import { Document } from 'mongoose';
import { z } from 'nestjs-zod/z';
import { PersonSchema } from '../schemas/people.schema';

type schemaType = z.infer<typeof PersonSchema>;

export interface People extends schemaType, Document {}
