import { InjectTenancyModel } from '@needle-innovision/nestjs-tenancy';
import { Injectable } from '@nestjs/common';
import { Family } from './interfaces/families.interface';
import { Model } from 'mongoose';
import { FamilyDto } from './dto/create-families.dto';
import { PaginatorDto } from 'src/utils/paginator/paginator.dto';
import { PaginatorInterface } from 'src/utils/paginator/paginator.interface';

@Injectable()
export class FamilyService {
  constructor(
    @InjectTenancyModel('FAMILY_MODEL')
    private readonly familyModel: Model<Family>,
  ) {}

  async update(id: string, feedStock: FamilyDto): Promise<Family> {
    return this.familyModel.findOneAndUpdate({ _id: id }, feedStock, {
      new: true,
    });
  }

  async create(feedStock: FamilyDto): Promise<Family> {
    return this.familyModel.create(feedStock);
  }

  async paginate(
    queryParams: PaginatorDto,
  ): Promise<PaginatorInterface<Family>> {
    const { page, limit, search } = queryParams;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.familyModel.paginate(
      search ? { $or: [{ name: { $regex: search, $options: 'i' } }] } : {},
      {
        page,
        limit,
      },
    );
  }

  async findOne(id: string): Promise<Family> {
    return this.familyModel.findOne({ _id: id });
  }

  async delete(id: string): Promise<Family> {
    return this.familyModel.findOneAndDelete({ _id: id });
  }
}
