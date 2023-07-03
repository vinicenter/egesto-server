import { Module } from '@nestjs/common';

import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { PersonMongooseSchema } from './schemas/people.schema';
import { TenancyModule } from '@needle-innovision/nestjs-tenancy';

@Module({
  imports: [
    TenancyModule.forFeature([
      { name: 'PEOPLE_MODEL', schema: PersonMongooseSchema },
    ]),
  ],
  controllers: [PeopleController],
  providers: [PeopleService],
  exports: [PeopleService],
})
export class PeopleModule {}
