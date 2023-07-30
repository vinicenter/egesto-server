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
import { CostsTableService } from './costsTable.service';
import { CostsTable } from './interfaces/costsTable.interface';
import { CostsTableDto } from './dto/create-costsTable.dto';
import { CostsTableUpdateDto } from './dto/update-costsTable.dto';
import { PaginatorDto } from 'src/utils/paginator/paginator.dto';
import { PaginatorInterface } from 'src/utils/paginator/paginator.interface';

@Controller('costs-table')
export class CostsTableController {
  constructor(private readonly costsTableService: CostsTableService) {}

  @Get()
  getAll(
    @Query() queryParams: PaginatorDto,
  ): Promise<PaginatorInterface<CostsTable>> {
    return this.costsTableService.paginate(queryParams);
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<CostsTable> {
    return this.costsTableService.findOne(id);
  }

  @Post()
  create(@Body() create: CostsTableDto): Promise<CostsTable> {
    return this.costsTableService.create(create);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() costsUpdated: CostsTableUpdateDto) {
    return this.costsTableService.update(id, costsUpdated);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.costsTableService.delete(id);
  }
}
