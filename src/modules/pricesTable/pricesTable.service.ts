import { InjectTenancyModel } from '@needle-innovision/nestjs-tenancy';
import { Injectable } from '@nestjs/common';
import { PricesTable } from './interfaces/pricesTable.interface';
import { Model } from 'mongoose';
import { PricesTableDto } from './dto/create-prices-table.dto';
import { PricesTableUpdateDto } from './dto/update-prices-table.dto';
import { PaginatorInterface } from 'src/utils/paginator/paginator.interface';
import { ProductModelType } from '../products/interfaces/product.interface';
import { Family } from '../families/interfaces/families.interface';
import { generateCsvString } from 'src/utils/generateCsvString';
import { PricesTablePaginateDto } from './dto/prices-table.dto';

@Injectable()
export class PricesTableService {
  constructor(
    @InjectTenancyModel('PRICES_TABLE_MODEL')
    private readonly pricesTableModel: Model<PricesTable>,
  ) {}

  async generateReportById(id: string): Promise<string> {
    const data = await this.pricesTableModel.findOne({ _id: id }).populate([
      {
        path: 'prices',
        populate: [
          {
            path: 'product',
            populate: {
              path: 'family',
              populate: 'linkedFamily',
            },
          },
        ],
      },
    ]);

    type PriceTableReport = {
      id: string;
      'Código do Produto': string;
      NCM: string;
      'Nome do Produto': string;
      'Peso do Produto': number;
      Família: string;
      Subfamília: string;
      Margem: number;
      Frete: number;
      Despesas: number;
      'Custo do Produto': number;
      Impostos: number;
      'Perda de Produção': number;
      'Preço de Venda': number;
    };

    if (!data) {
      throw new Error('price table not found.');
    }

    const csvData: PriceTableReport[] = [];

    data.prices.forEach((price) => {
      const product = price.product as unknown as ProductModelType;
      const family = product.family as unknown as Family;
      const linkedFamily = family.linkedFamily as unknown as Family;

      csvData.push({
        id: product._id,
        'Código do Produto': product.code,
        NCM: product.taxes?.ncm,
        'Nome do Produto': product.name,
        'Peso do Produto': product.unit?.weight,
        Família: family?.name,
        Subfamília: linkedFamily?.name,
        Margem: price.margin,
        Frete: price.shipment,
        Despesas: price.expense,
        'Custo do Produto': price.productCost,
        Impostos: price.tax,
        'Perda de Produção': product.production?.lost,
        'Preço de Venda': price.price,
      });
    });

    return generateCsvString(csvData);
  }

  async update(id: string, data: PricesTableUpdateDto): Promise<PricesTable> {
    return this.pricesTableModel.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });
  }

  async create(data: PricesTableDto): Promise<PricesTable> {
    return this.pricesTableModel.create(data);
  }

  async paginate(
    queryParams: PricesTablePaginateDto,
  ): Promise<PaginatorInterface<PricesTable>> {
    const { page, limit, search, orderBy, order, archived } = queryParams;

    const query = {};

    if (search) {
      query['$or'] = [{ name: { $regex: search, $options: 'i' } }];
    }

    if (archived === true || archived === false) {
      query['archived'] = archived;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.pricesTableModel.paginate(query, {
      page,
      limit,
      sort: { [orderBy]: order },
      populate: [
        'costTable',
        'customer',
        {
          path: 'prices',
          populate: 'product',
        },
      ],
    });
  }

  async findOne(id: string): Promise<PricesTable> {
    return this.pricesTableModel.findOne({ _id: id }).populate([
      'costTable',
      'customer',
      {
        path: 'prices',
        populate: [
          {
            path: 'product',
            populate: [
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
          },
        ],
      },
      {
        path: 'costTable',
        populate: {
          path: 'shipments',
          populate: [
            {
              path: 'products',
              populate: 'product',
            },
            {
              path: 'families',
              populate: 'family',
            },
          ],
        },
      },
    ]);
  }

  async delete(id: string): Promise<PricesTable> {
    return this.pricesTableModel.findOneAndDelete(
      { _id: id },
      { returnDocument: 'before' },
    );
  }
}
