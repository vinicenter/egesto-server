import { Module } from '@nestjs/common';

import { FeedStockService } from './feedstock.service';
import { FeedStockController } from './feedstock.controller';
import { FeedStockMongooseSchema } from './schemas/feedstock.schema';
import { TenancyModule } from '@needle-innovision/nestjs-tenancy';
import { BrandMongooseSchema } from '../brands/schemas/brand.schema';

@Module({
  imports: [
    TenancyModule.forFeature([
      { name: 'FEEDSTOCK_MODEL', schema: FeedStockMongooseSchema },
    ]),
    TenancyModule.forFeature([
      { name: 'BRAND_MODEL', schema: BrandMongooseSchema },
    ]),
  ],
  controllers: [FeedStockController],
  providers: [FeedStockService],
  exports: [FeedStockService],
})
export class FeedstockModule {}
