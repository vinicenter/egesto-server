import { Module } from '@nestjs/common';

import { ProductService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductMongooseSchema } from './models/product.model';
import { TenancyModule } from '@needle-innovision/nestjs-tenancy';
import { BrandMongooseSchema } from '../brands/schemas/brand.schema';
import { FamilyMongooseSchema } from '../families/schemas/families.schema';
import { FeedStockMongooseSchema } from '../feedstock/schemas/feedstock.schema';

@Module({
  imports: [
    TenancyModule.forFeature([
      { name: 'PRODUCT_MODEL', schema: ProductMongooseSchema },
    ]),
    TenancyModule.forFeature([
      { name: 'FAMILY_MODEL', schema: FamilyMongooseSchema },
    ]),
    TenancyModule.forFeature([
      { name: 'BRAND_MODEL', schema: BrandMongooseSchema },
    ]),
    TenancyModule.forFeature([
      { name: 'FEEDSTOCK_MODEL', schema: FeedStockMongooseSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProdutModule {}
