import { InjectTenancyModel } from '@needle-innovision/nestjs-tenancy';
import { Injectable } from '@nestjs/common';
import { People } from './interfaces/user.interface';
import { Model } from 'mongoose';
import { PeopleDto } from './dto/create-people.dto';

@Injectable()
export class PeopleService {
  constructor(
    @InjectTenancyModel('PEOPLE_MODEL')
    private readonly peopleModel: Model<People>,
  ) {}

  async update(id: string, people: PeopleDto): Promise<People> {
    return this.peopleModel.findOneAndUpdate({ _id: id }, people, {
      new: true,
    });
  }

  async create(people: PeopleDto): Promise<People> {
    return this.peopleModel.create(people);
  }

  async findAll(search: string, page = 1, limit = 20): Promise<People[]> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.peopleModel.paginate(
      search
        ? {
            $or: [
              { document: { $regex: search, $options: 'i' } },
              { fantasyName: { $regex: search, $options: 'i' } },
              { corporateName: { $regex: search, $options: 'i' } },
            ],
          }
        : {},
      {
        page,
        limit,
      },
    );
  }

  async findOne(id: string): Promise<People> {
    return this.peopleModel.findById(id);
  }

  async findByUsername(username: string): Promise<People> {
    return this.peopleModel.findOne({ username });
  }

  async delete(id: string): Promise<People> {
    return this.peopleModel.findOneAndDelete({ _id: id });
  }
}
