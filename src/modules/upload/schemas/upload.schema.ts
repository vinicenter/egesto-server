import { z } from 'nestjs-zod/z';

export const UploadDeleteSchema = z.object({
  files: z.array(z.string()),
});
