import { Module } from '@nestjs/common';

import { CostsTableService } from './costsTable.service';
import { CostsTableController } from './costsTable.controller';
import { CostsTableMongooseSchema } from './models/costsTable.model';
import { TenancyModule } from '@needle-innovision/nestjs-tenancy';

@Module({
  imports: [
    TenancyModule.forFeature([
      { name: 'COSTS_TABLE_MODEL', schema: CostsTableMongooseSchema },
    ]),
  ],
  controllers: [CostsTableController],
  providers: [CostsTableService],
  exports: [CostsTableService],
})
export class CostsTableModule {}
