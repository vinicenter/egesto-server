import { createZodDto } from 'nestjs-zod';
import { UserSchema } from '../schemas/user.schema';
import { z } from 'nestjs-zod/z';

const UserPassword = z.object({
  password: z.string().optional(),
});

const UserUpdateSchema = UserSchema.merge(UserPassword);

export class UserCreateDto extends createZodDto(UserSchema) {}
export class UserUpdateDto extends createZodDto(UserUpdateSchema) {}
