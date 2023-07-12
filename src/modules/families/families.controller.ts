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
import { FamilyService } from './families.service';
import { Family } from './interfaces/families.interface';
import { FamilyDto } from './dto/create-families.dto';

@Controller('families')
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  @Get()
  list(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ): Promise<Family[]> {
    return this.familyService.findAll(search, page, limit);
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<Family> {
    return this.familyService.findOne(id);
  }

  @Post()
  create(@Body() create: FamilyDto): Promise<Family> {
    return this.familyService.create(create);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() createUserDto: FamilyDto) {
    return this.familyService.update(id, createUserDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.familyService.delete(id);
  }
}
