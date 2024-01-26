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
import { FamilyDefaultCostDto, FamilyDto } from './dto/create-families.dto';
import { PaginatorDto } from 'src/utils/paginator/paginator.dto';
import { PaginatorInterface } from 'src/utils/paginator/paginator.interface';

@Controller('families')
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  @Get('/default-costs')
  getDefaultCosts() {
    return this.familyService.getDefaultCosts();
  }

  @Patch('/default-costs')
  defineDefaultCosts(@Body() data: FamilyDefaultCostDto) {
    return this.familyService.updateDefaultCosts(data);
  }

  @Get()
  getAll(
    @Query() queryParams: PaginatorDto,
  ): Promise<PaginatorInterface<Family>> {
    return this.familyService.paginate(queryParams);
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
