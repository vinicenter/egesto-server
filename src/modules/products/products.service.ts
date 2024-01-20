import { InjectTenancyModel } from '@needle-innovision/nestjs-tenancy';
import { Injectable } from '@nestjs/common';
import {
  ProductDescriptionPromptParams,
  ProductModelType,
  ProductType,
} from './interfaces/product.interface';
import { Model } from 'mongoose';
import { PaginatorInterface } from 'src/utils/paginator/paginator.interface';
import { getModel } from 'src/utils/googleGenerativeAi';
import { makeProductDescriptionPrompt } from 'src/modules/products/prompts/productDescription';

import {
  ProductCreateDto,
  ProductUpdateDto,
  ProductPaginateDto,
} from './dto/product.dto';

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

  async paginate(
    queryParams: ProductPaginateDto,
  ): Promise<PaginatorInterface<ProductType>> {
    const {
      brandId,
      familyId,
      feedstockId,
      limit,
      page,
      search,
      orderBy,
      order,
    } = queryParams;

    const query = {};

    if (feedstockId) {
      query['production.formulation.feedstock'] = feedstockId;
    }

    if (brandId) {
      query['brand'] = brandId;
    }

    if (familyId) {
      query['family'] = familyId;
    }

    if (search) {
      query['$or'] = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = (await this.productModel.paginate(query, {
      page,
      limit,
      populate: [
        'brand',
        {
          path: 'family',
          populate: 'linkedFamily',
        },
        {
          path: 'production',
          populate: {
            path: 'formulation',
            populate: 'feedstock',
          },
        },
      ],
      sort: { [orderBy]: order },
    })) as Promise<PaginatorInterface<ProductType>>;

    return result;
  }

  async findOne(id: string): Promise<ProductType> {
    const result = await this.productModel.findById(id).populate([
      'brand',
      {
        path: 'family',
        populate: 'linkedFamily',
      },
      {
        path: 'production',
        populate: {
          path: 'formulation',
          populate: 'feedstock',
        },
      },
    ]);

    return result;
  }

  async delete(id: string): Promise<ProductModelType> {
    return this.productModel.findOneAndDelete(
      { _id: id },
      { returnDocument: 'before' },
    );
  }

  async generateDescriptionAiFromProduct(
    params: ProductDescriptionPromptParams,
  ): Promise<string> {
    const model = getModel({
      model: 'gemini-pro',
    });

    const prompt = makeProductDescriptionPrompt(params);

    const result = await model.generateContent(prompt);

    return result.response.candidates[0].content.parts[0].text || '';
  }
}
