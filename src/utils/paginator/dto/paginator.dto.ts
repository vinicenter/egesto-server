import { createZodDto } from 'nestjs-zod';
import { PaginatorSchema } from '../schemas/paginator.schema';

export class PaginatorDto extends createZodDto(PaginatorSchema) {}
