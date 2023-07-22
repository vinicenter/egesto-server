import { InjectTenancyModel } from '@needle-innovision/nestjs-tenancy';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Brand } from './interfaces/brands.interface';
import { BrandDto } from './dto/create-brand.dto';
import { PaginatorDto } from 'src/utils/paginator/dto/paginator.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectTenancyModel('BRAND_MODEL')
    private readonly brandModel: Model<Brand>,
  ) {}

  async update(id: string, brand: BrandDto): Promise<Brand> {
    return this.brandModel.findOneAndUpdate({ _id: id }, brand, {
      new: true,
    });
  }

  async create(brand: BrandDto): Promise<Brand> {
    return this.brandModel.create(brand);
  }

  async paginate(queryParams: PaginatorDto): Promise<Brand[]> {
    const { page, limit, search } = queryParams;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.brandModel.paginate(
      search
        ? {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } },
            ],
          }
        : {},
      {
        page,
        limit,
      },
    );
  }

  async findOne(id: string): Promise<Brand> {
    return this.brandModel.findById(id);
  }

  async delete(id: string): Promise<Brand> {
    return this.brandModel.findOneAndDelete({ _id: id });
  }
}
