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

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  getBrands(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ): Promise<Brand[]> {
    return this.brandsService.findAll(search, page, limit);
  }

  @Get(':id')
  getUser(@Param('id') id: string): Promise<Brand> {
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
