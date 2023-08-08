import { Module } from '@nestjs/common';

import { PricesTableService } from './pricesTable.service';
import { PricesTableController } from './pricesTable.controller';
import { PricesTableMongooseSchema } from './models/pricesTable.model';
import { TenancyModule } from '@needle-innovision/nestjs-tenancy';

@Module({
  imports: [
    TenancyModule.forFeature([
      { name: 'PRICES_TABLE_MODEL', schema: PricesTableMongooseSchema },
    ]),
  ],
  controllers: [PricesTableController],
  providers: [PricesTableService],
  exports: [PricesTableService],
})
export class PricesTableModule {}
