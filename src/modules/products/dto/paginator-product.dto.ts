import { createZodDto } from 'nestjs-zod';
import { ProductPaginatorSchema } from '../schemas/product.schema';

export class ProductPaginateDto extends createZodDto(ProductPaginatorSchema) {}
