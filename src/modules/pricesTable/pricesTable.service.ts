import { InjectTenancyModel } from '@needle-innovision/nestjs-tenancy';
import { Injectable } from '@nestjs/common';
import { PricesTable } from './interfaces/pricesTable.interface';
import { Model } from 'mongoose';
import { PricesTableDto } from './dto/create-prices-table.dto';
import { PricesTableUpdateDto } from './dto/update-prices-table.dto';
import { PaginatorDto } from 'src/utils/paginator/paginator.dto';
import { PaginatorInterface } from 'src/utils/paginator/paginator.interface';
import { ProductModelType } from '../products/interfaces/product.interface';
import { Family } from '../families/interfaces/families.interface';
import {
  PriceTableReport,
  PriceTableReportData,
} from './interfaces/priceTableReport.interface';

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

    if (!data) {
      throw new Error('price table not found.');
    }

    const csvData: PriceTableReport = [
      [
        'ID',
        'Código do Produto',
        'NCM',
        'Nome do Produto',
        'Peso do Produto',
        'Família',
        'Subfamília',
        'Margem',
        'Frete',
        'Despesas',
        'Custo do Produto',
        'Impostos',
        'Perda de Produção',
        'Preço de Venda',
      ],
    ];

    data.prices.forEach((price) => {
      const product = price.product as unknown as ProductModelType;
      const family = product.family as unknown as Family;
      const linkedFamily = family.linkedFamily as unknown as Family;

      csvData.push([
        product._id,
        product.code,
        product.taxes?.ncm,
        product.name,
        product.unit?.weight,
        family?.name,
        linkedFamily?.name,
        price.margin,
        price.shipment,
        price.expense,
        price.productCost,
        price.tax,
        product.production?.lost,
        price.price,
      ]);
    });

    csvData.forEach((data) => {
      const row = data as PriceTableReportData;

      row.join(',');
    });

    const csvString = csvData.join('\n');

    return csvString;
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
    queryParams: PaginatorDto,
  ): Promise<PaginatorInterface<PricesTable>> {
    const { page, limit, search, orderBy, order } = queryParams;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.pricesTableModel.paginate(
      search ? { $or: [{ name: { $regex: search, $options: 'i' } }] } : {},
      {
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
      },
    );
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
