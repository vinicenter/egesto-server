import { createZodDto } from 'nestjs-zod';
import { UserSchema } from '../schemas/user.schema';

export class UserDto extends createZodDto(UserSchema) {}
