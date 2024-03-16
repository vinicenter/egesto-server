import { Module } from '@nestjs/common';
import { BillService } from './bills.service';
import { BillsController } from './bills.controller';
import { TenancyModule } from '@needle-innovision/nestjs-tenancy';
import { BillMongooseSchema } from './schemas/bills.schema';

@Module({
  imports: [
    TenancyModule.forFeature([
      { name: 'BILL_MODEL', schema: BillMongooseSchema },
    ]),
  ],
  controllers: [BillsController],
  providers: [BillService],
  exports: [BillService],
})
export class BillsModule {}
