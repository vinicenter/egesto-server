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
import { ProductCreateDto } from './dto/create-product.dto';
import { ProductUpdateDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ): Promise<ProductModelType[]> {
    return this.productService.findAll(search, page, limit);
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
