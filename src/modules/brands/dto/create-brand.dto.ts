import { createZodDto } from 'nestjs-zod';
import { BrandSchema } from '../schemas/brand.schema';

export class BrandDto extends createZodDto(BrandSchema) {}
