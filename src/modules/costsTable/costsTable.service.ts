import { InjectTenancyModel } from '@needle-innovision/nestjs-tenancy';
import { Injectable } from '@nestjs/common';
import { CostsTable } from './interfaces/costsTable.interface';
import { Model } from 'mongoose';
import { CostsTableDto } from './dto/create-costsTable.dto';
import { PaginatorDto } from 'src/utils/paginator/paginator.dto';
import { PaginatorInterface } from 'src/utils/paginator/paginator.interface';

@Injectable()
export class CostsTableService {
  constructor(
    @InjectTenancyModel('COSTS_TABLE_MODEL')
    private readonly costsTableModel: Model<CostsTable>,
  ) {}

  async update(id: string, feedStock: CostsTableDto): Promise<CostsTable> {
    return this.costsTableModel.findOneAndUpdate({ _id: id }, feedStock, {
      new: true,
    });
  }

  async create(feedStock: CostsTableDto): Promise<CostsTable> {
    return this.costsTableModel.create(feedStock);
  }

  async paginate(
    queryParams: PaginatorDto,
  ): Promise<PaginatorInterface<CostsTable>> {
    const { page, limit, search, orderBy, order } = queryParams;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.costsTableModel.paginate(
      search ? { $or: [{ name: { $regex: search, $options: 'i' } }] } : {},
      {
        page,
        limit,
        sort: { [orderBy]: order },
        populate: [
          {
            path: 'shipments',
            populate: {
              path: 'products',
              populate: 'product',
            },
          },
          {
            path: 'shipments',
            populate: {
              path: 'families',
              populate: 'family',
            },
          },
        ],
      },
    );
  }

  async findOne(id: string): Promise<CostsTable> {
    return this.costsTableModel.findOne({ _id: id }).populate([
      {
        path: 'shipments',
        populate: {
          path: 'products',
          populate: 'product',
        },
      },
      {
        path: 'shipments',
        populate: {
          path: 'families',
          populate: {
            path: 'family',
            populate: 'linkedFamily',
          },
        },
      },
    ]);
  }

  async delete(id: string): Promise<CostsTable> {
    return this.costsTableModel.findOneAndDelete(
      { _id: id },
      { returnDocument: 'before' },
    );
  }
}
