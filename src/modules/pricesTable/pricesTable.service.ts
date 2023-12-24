import { InjectTenancyModel } from '@needle-innovision/nestjs-tenancy';
import { Injectable } from '@nestjs/common';
import { PricesTable } from './interfaces/pricesTable.interface';
import { Model } from 'mongoose';
import { PricesTableDto } from './dto/create-prices-table.dto';
import { PricesTableUpdateDto } from './dto/update-prices-table.dto';
import { PaginatorDto } from 'src/utils/paginator/paginator.dto';
import { PaginatorInterface } from 'src/utils/paginator/paginator.interface';

@Injectable()
export class PricesTableService {
  constructor(
    @InjectTenancyModel('PRICES_TABLE_MODEL')
    private readonly pricesTableModel: Model<PricesTable>,
  ) {}

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
