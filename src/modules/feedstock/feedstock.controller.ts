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
import { FeedStockService } from './feedstock.service';
import { FeedStock } from './interfaces/feedstock.interface';
import { CreateFeedStockDto } from './dto/create-feedstock.dto';
import { UpdateFeedStockDto } from './dto/update-feedstock.dto';
import { PaginatorDto } from 'src/utils/paginator/paginator.dto';
import { PaginatorInterface } from 'src/utils/paginator/paginator.interface';

@Controller('feedstocks')
export class FeedStockController {
  constructor(private readonly feedStockService: FeedStockService) {}

  @Get()
  getAll(
    @Query() queryParams: PaginatorDto,
  ): Promise<PaginatorInterface<FeedStock>> {
    return this.feedStockService.paginate(queryParams);
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<FeedStock> {
    return this.feedStockService.findOne(id);
  }

  @Post()
  create(@Body() data: CreateFeedStockDto): Promise<FeedStock> {
    return this.feedStockService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateFeedStockDto) {
    return this.feedStockService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.feedStockService.delete(id);
  }
}
