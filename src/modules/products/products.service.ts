import { InjectTenancyModel } from '@needle-innovision/nestjs-tenancy';
import { Injectable } from '@nestjs/common';
import { ProductModelType, ProductType } from './interfaces/product.interface';
import { Model } from 'mongoose';
import { ProductCreateDto } from './dto/create-product.dto';
import { ProductUpdateDto } from './dto/update-product.dto';
import { calculateTotalCost } from './products.repository';

@Injectable()
export class ProductService {
  constructor(
    @InjectTenancyModel('PRODUCT_MODEL')
    private readonly productModel: Model<ProductModelType>,
  ) {}

  async update(
    id: string,
    product: ProductUpdateDto,
  ): Promise<ProductModelType> {
    return this.productModel.findOneAndUpdate({ _id: id }, product, {
      new: true,
    });
  }

  async create(product: ProductCreateDto): Promise<ProductModelType> {
    return this.productModel.create(product);
  }

  async findAll(
    search: string,
    page = 1,
    limit = 20,
  ): Promise<ProductModelType[]> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const data = this.productModel.paginate(
      search
        ? {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { code: { $regex: search, $options: 'i' } },
            ],
          }
        : {},
      {
        page,
        limit,
        populate: [
          'brand',
          'family',
          {
            path: 'production',
            populate: {
              path: 'formulation',
              populate: 'feedstock',
            },
          },
        ],
      },
    );

    return data;
  }

  async findOne(id: string): Promise<ProductType> {
    const result = await this.productModel.findById(id).populate([
      'brand',
      'family',
      {
        path: 'production',
        populate: {
          path: 'formulation',
          populate: 'feedstock',
        },
      },
    ]);

    const data = result.toObject() as ProductType;

    if (data.production) {
      data.production.cost = calculateTotalCost(result);
    }

    if (data.pack) {
      data.pack.weight = data.unit.weight * data.pack.numberOfUnitsInPack;
    }

    return data;
  }

  async delete(id: string): Promise<ProductModelType> {
    return this.productModel.findOneAndDelete({ _id: id });
  }
}
