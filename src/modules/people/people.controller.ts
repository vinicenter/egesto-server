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
import { PeopleService } from './people.service';
import { People } from './interfaces/people.interface';
import { PeopleDto } from './dto/create-people.dto';
import { PaginatorDto } from 'src/utils/paginator/dto/paginator.dto';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Get()
  getAll(@Query() queryParams: PaginatorDto): Promise<People[]> {
    return this.peopleService.findAll(queryParams);
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<People> {
    return this.peopleService.findOne(id);
  }

  @Post()
  create(@Body() createUserDto: PeopleDto): Promise<People> {
    return this.peopleService.create(createUserDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() createUserDto: PeopleDto) {
    return this.peopleService.update(id, createUserDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.peopleService.delete(id);
  }
}
