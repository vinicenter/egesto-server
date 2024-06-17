import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from '../modules/auth/auth.module';
import { UsersModule } from '../modules/users/users.module';
import { PeopleModule } from 'src/modules/people/people.module';
import { BrandsModule } from 'src/modules/brands/brands.module';
import { FeedstockModule } from 'src/modules/feedstock/feedstock.module';
import { FamiliesModule } from 'src/modules/families/families.module';
import { ProdutModule } from 'src/modules/products/products.module';
import { CostsTableModule } from 'src/modules/costsTable/costsTable.module';
import { PricesTableModule } from 'src/modules/pricesTable/pricesTable.module';
import { BillsModule } from 'src/modules/bills/bills.module';
import { UploadModule } from 'src/modules/upload/upload.module';

import { ZodValidationPipe } from 'nestjs-zod';
import { APP_PIPE } from '@nestjs/core';
import { TenancyModule } from '@needle-innovision/nestjs-tenancy';
import { tenantIdentifier } from 'src/constants/general';

@Module({
  imports: [
    TenancyModule.forRoot({
      tenantIdentifier,
      options: () => null,
      uri: (tenantId: string) => {
        const uri = process.env.MONGO_URI + `/${tenantId}?authSource=admin`;

        // mongoose.connect(uri);

        return uri;
      },
    }),
    UsersModule,
    PeopleModule,
    AuthModule,
    BrandsModule,
    FeedstockModule,
    FamiliesModule,
    ProdutModule,
    CostsTableModule,
    PricesTableModule,
    BillsModule,
    UploadModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
