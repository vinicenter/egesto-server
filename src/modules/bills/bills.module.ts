import { Module } from '@nestjs/common';
import { BillService } from './bills.service';
import { BillsController } from './bills.controller';
import { TenancyModule } from '@needle-innovision/nestjs-tenancy';
import { BillMongooseSchema } from './schemas/bills.schema';
import { BillTagMongooseSchema } from './schemas/billTags.schema';

@Module({
  imports: [
    TenancyModule.forFeature([
      { name: 'BILL_MODEL', schema: BillMongooseSchema },
      { name: 'BILL_TAG_MODEL', schema: BillTagMongooseSchema },
    ]),
  ],
  controllers: [BillsController],
  providers: [BillService],
  exports: [BillService],
})
export class BillsModule {}
