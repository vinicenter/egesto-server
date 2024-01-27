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
import { PricesTableService } from './pricesTable.service';
import { PricesTable } from './interfaces/pricesTable.interface';
import { PricesTableDto } from './dto/create-prices-table.dto';
import { PricesTableUpdateDto } from './dto/update-prices-table.dto';
import { PaginatorInterface } from 'src/utils/paginator/paginator.interface';
import { PricesTablePaginateDto } from './dto/prices-table.dto';

@Controller('prices-table')
export class PricesTableController {
  constructor(private readonly pricesTableService: PricesTableService) {}

  @Get()
  getAll(
    @Query() queryParams: PricesTablePaginateDto,
  ): Promise<PaginatorInterface<PricesTable>> {
    return this.pricesTableService.paginate(queryParams);
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<PricesTable> {
    return this.pricesTableService.findOne(id);
  }

  @Get(':id/report')
  async reportById(
    @Param('id') id: string,
    @Response({ passthrough: true }) res,
  ): Promise<string> {
    res.setHeader('Content-Type', 'text/csv');

    return this.pricesTableService.generateReportById(id);
  }

  @Post()
  create(@Body() data: PricesTableDto): Promise<PricesTable> {
    return this.pricesTableService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: PricesTableUpdateDto) {
    return this.pricesTableService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.pricesTableService.delete(id);
  }
}
