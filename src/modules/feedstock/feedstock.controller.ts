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

@Controller('feedstocks')
export class FeedStockController {
  constructor(private readonly feedStockService: FeedStockService) {}

  @Get()
  getFeedStock(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ): Promise<FeedStock[]> {
    return this.feedStockService.findAll(search, page, limit);
  }

  @Get(':id')
  getUser(@Param('id') id: string): Promise<FeedStock> {
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
