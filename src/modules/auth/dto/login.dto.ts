import { createZodDto } from 'nestjs-zod';
import { LoginSchema } from '../schema/login.schema';

export class LoginDto extends createZodDto(LoginSchema) {}
