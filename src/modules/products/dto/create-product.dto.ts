import { createZodDto } from 'nestjs-zod';
import { ProductModelSchema } from '../schemas/product.schema';

export class ProductCreateDto extends createZodDto(ProductModelSchema) {}
