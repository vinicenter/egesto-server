import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from '../modules/auth/auth.module';
import { UsersModule } from '../modules/users/users.module';
import { PeopleModule } from 'src/modules/people/people.module';
import { BrandsModule } from 'src/modules/brands/brands.module';
import { FeedstockModule } from 'src/modules/feedstock/feedstock.module';

import { ZodValidationPipe } from 'nestjs-zod';
import { APP_PIPE } from '@nestjs/core';
import { TenancyModule } from '@needle-innovision/nestjs-tenancy';
import mongoose from 'mongoose';

@Module({
  imports: [
    TenancyModule.forRoot({
      tenantIdentifier: 'x-tenant',
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      options: () => {},
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
