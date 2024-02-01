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
import { generateCsvString } from 'src/utils/generateCsvString';
import { Family } from '../families/interfaces/families.interface';
import { Brand } from '../brands/interfaces/brands.interface';
import { populateFormulation } from './constants/product-population';

@Injectable()
export class ProductService {
  constructor(
    @InjectTenancyModel('PRODUCT_MODEL')
    private readonly productModel: Model<ProductModelType>,
  ) {}

  async generateReport(): Promise<string> {
    const data = await this.productModel.find().populate([
      'brand',
      {
        path: 'family',
        populate: 'linkedFamily',
      },
      {
        path: 'production',
        populate: {
          path: 'formulation',
          populate: populateFormulation,
        },
      },
    ]);

    if (!data) {
      throw new Error('feedstock not found.');
    }

    type ProductReport = {
      id: string;
      código: string;
      nome: string;
      familia: string;
      subfamilia: string;
      marca: string;
      'un p/ pack': number;
      'peso unidade': number;
      'peso pack': number;
      'custo unidade': number;
      'custo pack': number;
      ncm: string;
      cest: string;
      'perda producao': number;
      'quantidade no palete': number;
      ean13: string;
      dun14: string;
      publico: string;
      cor: string;
      descricao: string;
    };

    const csvData: ProductReport[] = [];

    data.forEach((product) => {
      const productReport = product as ProductType;

      const family = product.family as unknown as Family;
      const linkedFamily = family?.linkedFamily as unknown as Family;
      const brand = product.brand as unknown as Brand;

      csvData.push({
        id: product._id,
        código: productReport.code,
        nome: productReport.name,
        familia: family?.name,
        subfamilia: linkedFamily?.name,
        marca: brand?.name,
        'un p/ pack': productReport.pack.numberOfUnitsInPack,
        'peso unidade': productReport.unit.weight,
        'peso pack': productReport.packWeight,
        'custo unidade': productReport.productionCost.unitCost,
        'custo pack': productReport.productionCost.packCost,
        ncm: productReport.taxes.ncm,
        cest: productReport.taxes.cest,
        'perda producao': productReport.production.lost,
        'quantidade no palete': productReport.pack.numberOfPacksInPallet,
        ean13: productReport.unit.barcodeEan13,
        dun14: productReport.pack.barcodeDun14,
        publico: productReport.marketing.isPublic ? 'Sim' : 'Não',
        cor: productReport.marketing.color,
        descricao: productReport.marketing.description,
      });
    });

    return generateCsvString(csvData);
  }

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
      onlyFeedstockEnabled,
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

    if (onlyFeedstockEnabled) {
      query['production.canBeFeedstock'] = onlyFeedstockEnabled;
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
            populate: populateFormulation,
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
          populate: populateFormulation,
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
