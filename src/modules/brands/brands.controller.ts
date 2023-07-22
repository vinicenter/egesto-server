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
import { Brand } from './interfaces/brands.interface';
import { BrandDto } from './dto/create-brand.dto';
import { BrandsService } from './brands.service';
import { PaginatorDto } from 'src/utils/paginator/dto/paginator.dto';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  getAll(@Query() queryParams: PaginatorDto): Promise<Brand[]> {
    return this.brandsService.paginate(queryParams);
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<Brand> {
    return this.brandsService.findOne(id);
  }

  @Post()
  create(@Body() createBrandDto: BrandDto): Promise<Brand> {
    return this.brandsService.create(createBrandDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() createBrandDto: BrandDto) {
    return this.brandsService.update(id, createBrandDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Brand> {
    return this.brandsService.delete(id);
  }
}
