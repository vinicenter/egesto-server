import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from '../modules/auth/auth.module';
import { UsersModule } from '../modules/users/users.module';

import { ZodValidationPipe } from 'nestjs-zod';
import { APP_PIPE } from '@nestjs/core';
import { TenancyModule } from '@needle-innovision/nestjs-tenancy';

@Module({
  imports: [
    TenancyModule.forRoot({
      tenantIdentifier: 'x-tenant',
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      options: () => {},
      uri: (tenantId: string) => {
        return process.env.MONGO_URI + `/${tenantId}?authSource=admin`;
      },
    }),
    UsersModule,
    AuthModule,
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
