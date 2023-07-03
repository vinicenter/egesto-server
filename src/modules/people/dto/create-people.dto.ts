import { createZodDto } from 'nestjs-zod';
import { PersonSchema } from '../schemas/people.schema';

export class PeopleDto extends createZodDto(PersonSchema) {}
