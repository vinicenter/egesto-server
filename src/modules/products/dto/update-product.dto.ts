import { createZodDto } from 'nestjs-zod';
import { ProductModelSchema } from '../schemas/product.schema';

const ProductUpdateSchema = ProductModelSchema.partial().strip();

export class ProductUpdateDto extends createZodDto(ProductUpdateSchema) {}
