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
import { People } from './interfaces/user.interface';
import { PeopleDto } from './dto/create-people.dto';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Get()
  getPeople(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ): Promise<People[]> {
    return this.peopleService.findAll(search, page, limit);
  }

  @Get(':id')
  getUser(@Param('id') id: string): Promise<People> {
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
