import { Document } from 'mongoose';
import { z } from 'nestjs-zod/z';
import { UserSchema } from '../schemas/user.schema';

type schemaType = z.infer<typeof UserSchema>;

export interface User extends schemaType, Document {}
