import { createZodDto } from 'nestjs-zod';
import { ProductGenerateDescriptionAiSchema } from '../schemas/product.schema';
import { ProductPaginatorSchema } from '../schemas/product.schema';
import { ProductModelSchema } from '../schemas/product.schema';

const ProductUpdateSchema = ProductModelSchema.partial().strip();
export class ProductUpdateDto extends createZodDto(ProductUpdateSchema) {}

export class ProductCreateDto extends createZodDto(ProductModelSchema) {}

export class ProductPaginateDto extends createZodDto(ProductPaginatorSchema) {}

export class ProductGenerateDescriptionAiDto extends createZodDto(
  ProductGenerateDescriptionAiSchema,
) {}
