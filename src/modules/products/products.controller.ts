import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductModelType, ProductType } from './interfaces/product.interface';
import { PaginatorInterface } from 'src/utils/paginator/paginator.interface';

import {
  ProductPaginateDto,
  ProductCreateDto,
  ProductUpdateDto,
  ProductGenerateDescriptionAiDto,
} from './dto/product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAll(
    @Query() queryParams: ProductPaginateDto,
  ): Promise<PaginatorInterface<ProductType>> {
    return this.productService.paginate(queryParams);
  }

  @Get('generate-description-ai')
  generateDescriptionAi(
    @Query() data: ProductGenerateDescriptionAiDto,
  ): Promise<string> {
    return this.productService.generateDescriptionAiFromProduct(data);
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<ProductType> {
    return this.productService.findOne(id);
  }

  @Post()
  create(@Body() data: ProductCreateDto): Promise<ProductModelType> {
    return this.productService.create(data);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: ProductUpdateDto,
  ): Promise<ProductModelType> {
    return this.productService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<ProductModelType> {
    return this.productService.delete(id);
  }
}
