import { createZodDto } from 'nestjs-zod';
import { UploadDeleteSchema } from '../schemas/upload.schema';

export class UploadDeleteDto extends createZodDto(UploadDeleteSchema) {}
