import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { TenancyModule } from '@needle-innovision/nestjs-tenancy';
import { BrandMongooseSchema } from './schemas/brand.schema';

@Module({
  imports: [
    TenancyModule.forFeature([
      { name: 'BRAND_MODEL', schema: BrandMongooseSchema },
    ]),
  ],
  controllers: [BrandsController],
  providers: [BrandsService],
  exports: [BrandsService],
})
export class BrandsModule {}
