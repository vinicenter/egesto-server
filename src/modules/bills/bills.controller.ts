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
  BillCumulativeReportDto,
  BillPaginatorDto,
  CreateBillDto,
  CreateBillTagDto,
  UpdateBillDto,
  UpdateBillTagDto,
} from './dto/bills.dto';
import { BillService } from './bills.service';
import { PaginatorInterface } from 'src/utils/paginator/paginator.interface';
import { PaginatorDto } from 'src/utils/paginator/paginator.dto';

@Controller('bills')
export class BillsController {
  constructor(private readonly billService: BillService) {}

  @Get('tags')
  getAllTags(@Query() queryParams: PaginatorDto) {
    return this.billService.paginateTags(queryParams);
  }

  @Post('tags')
  createTag(@Body() data: CreateBillTagDto) {
    return this.billService.createTag(data);
  }

  @Patch('tags/:id')
  updateTag(@Param('id') id: string, @Body() data: UpdateBillTagDto) {
    return this.billService.updateTag(id, data);
  }

  @Delete('tags/:id')
  deleteTag(@Param('id') id: string) {
    return this.billService.deleteTag(id);
  }

  @Get('cumulative')
  cumulativeReport(@Query() queryParams: BillCumulativeReportDto) {
    return this.billService.cumulativeReport(queryParams);
  }

  @Get('summary')
  summary(@Query() queryParams: BillPaginatorDto) {
    return this.billService.summary(queryParams);
  }

  @Get('export')
  export(@Query() queryParams: BillPaginatorDto): Promise<string> {
    return this.billService.export(queryParams);
  }

  @Get()
  getAll(
    @Query() queryParams: BillPaginatorDto,
  ): Promise<PaginatorInterface<Bill>> {
    return this.billService.paginate(queryParams);
  }

  @Post()
  create(@Body() data: CreateBillDto): Promise<Bill> {
    return this.billService.create(data);
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<Bill> {
    return this.billService.findOne(id);
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
