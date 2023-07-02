import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserMongooseSchema } from './schemas/user.schema';
import { TenancyModule } from '@needle-innovision/nestjs-tenancy';

@Module({
  imports: [
    TenancyModule.forFeature([
      { name: 'USER_MODEL', schema: UserMongooseSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
