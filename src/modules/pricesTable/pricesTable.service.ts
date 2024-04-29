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
import { populateFormulation } from '../products/constants/product-population';
import { softDelete } from 'src/utils/softDelete';

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
      'Peso do Produto': string;
      Família: string;
      Subfamília: string;
      Margem: string;
      Frete: string;
      Despesas: string;
      'Custo do Produto': string;
      Impostos: string;
      'Perda de Produção': string;
      'Preço de Venda': string;
    };

    if (!data) {
      throw new Error('price table not found.');
    }

    const csvData: PriceTableReport[] = [];

    const formatToPtCurrency = (value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        currency: 'BRL',
        maximumFractionDigits: 5,
        minimumFractionDigits: 5,
      }).format(value);
    };

    data.prices.forEach((price) => {
      const product = price.product as unknown as ProductModelType;
      const family = product.family as unknown as Family;
      const linkedFamily = family?.linkedFamily as unknown as Family;

      csvData.push({
        id: product._id,
        'Código do Produto': product.code,
        NCM: product.taxes?.ncm,
        'Nome do Produto': product.name,
        'Peso do Produto': `${product.unit?.weight} ${product.UnitOfMeasurement}`,
        Família: linkedFamily?.name,
        Subfamília: family?.name,
        Margem: formatToPtCurrency(price.margin),
        Frete: `${price.shipment}%`,
        Despesas: `${price.expense}%`,
        'Custo do Produto': formatToPtCurrency(price.productCost),
        Impostos: `${price.tax}%`,
        'Perda de Produção': `${product.production?.lost}%`,
        'Preço de Venda': formatToPtCurrency(price.price),
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

    query['deletedAt'] = null;

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
                  populate: populateFormulation,
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
    return softDelete(this.pricesTableModel, id);
  }
}
