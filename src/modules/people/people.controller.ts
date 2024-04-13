import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Response,
} from '@nestjs/common';
import { PeopleService } from './people.service';
import { People } from './interfaces/people.interface';
import { PeopleDto } from './dto/create-people.dto';
import { PaginatorDto } from 'src/utils/paginator/paginator.dto';
import { PaginatorInterface } from 'src/utils/paginator/paginator.interface';
import { ConsultCnpjData } from './types/consult-cnpj-data';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Get()
  getAll(
    @Query() queryParams: PaginatorDto,
  ): Promise<PaginatorInterface<People>> {
    return this.peopleService.paginate(queryParams);
  }

  @Get('consult-cnpj/:cnpj')
  consultCnpj(@Param('cnpj') cnpj: string): Promise<ConsultCnpjData.Root> {
    return this.peopleService.consultCnpjInReceitaWS(cnpj);
  }

  @Get('report')
  report(@Response({ passthrough: true }) res): Promise<string> {
    res.setHeader('Content-Type', 'text/csv');

    return this.peopleService.generateReport();
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
