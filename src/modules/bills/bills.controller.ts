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
import type { Bill } from './interfaces/bills.interface';
import {
  BillPaginatorDto,
  CreateBillDto,
  UpdateBillDto,
} from './dto/bills.dto';
import { BillService } from './bills.service';
import { PaginatorInterface } from 'src/utils/paginator/paginator.interface';

@Controller('bills')
export class BillsController {
  constructor(private readonly billService: BillService) {}

  @Get('summary')
  summary(@Query() queryParams: BillPaginatorDto) {
    return this.billService.summary(queryParams);
  }

  @Get()
  getAll(
    @Query() queryParams: BillPaginatorDto,
  ): Promise<PaginatorInterface<Bill>> {
    return this.billService.paginate(queryParams);
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<Bill> {
    return this.billService.findOne(id);
  }

  @Post()
  create(@Body() data: CreateBillDto): Promise<Bill> {
    return this.billService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateBillDto) {
    return this.billService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Bill> {
    return this.billService.delete(id);
  }
}
