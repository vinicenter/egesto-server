import { z } from 'nestjs-zod/z';

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});
