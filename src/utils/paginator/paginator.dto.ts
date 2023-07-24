import { createZodDto } from 'nestjs-zod';
import { PaginatorSchema } from './paginator.schema';

export class PaginatorDto extends createZodDto(PaginatorSchema) {}
