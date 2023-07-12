import { Module } from '@nestjs/common';

import { FamilyService } from './families.service';
import { FamilyController } from './families.controller';
import { FamilyMongooseSchema } from './schemas/families.schema';
import { TenancyModule } from '@needle-innovision/nestjs-tenancy';

@Module({
  imports: [
    TenancyModule.forFeature([
      { name: 'FAMILY_MODEL', schema: FamilyMongooseSchema },
    ]),
  ],
  controllers: [FamilyController],
  providers: [FamilyService],
  exports: [FamilyService],
})
export class FamiliesModule {}
