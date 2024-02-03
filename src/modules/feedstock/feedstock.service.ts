import { InjectTenancyModel } from '@needle-innovision/nestjs-tenancy';
import { Injectable } from '@nestjs/common';
import { FeedStock } from './interfaces/feedstock.interface';
import { Model } from 'mongoose';
import { CreateFeedStockDto } from './dto/create-feedstock.dto';
import { UpdateFeedStockDto } from './dto/update-feedstock.dto';
import { PaginatorDto } from 'src/utils/paginator/paginator.dto';
import { PaginatorInterface } from 'src/utils/paginator/paginator.interface';
import { Brand } from '../brands/interfaces/brands.interface';
import { generateCsvString } from 'src/utils/generateCsvString';
import { softDelete } from 'src/utils/softDelete';

@Injectable()
export class FeedStockService {
  constructor(
    @InjectTenancyModel('FEEDSTOCK_MODEL')
    private readonly feedStockModel: Model<FeedStock>,
  ) {}

  async update(id: string, feedStock: UpdateFeedStockDto): Promise<FeedStock> {
    return this.feedStockModel.findOneAndUpdate({ _id: id }, feedStock, {
      new: true,
    });
  }

  async create(feedStock: CreateFeedStockDto): Promise<FeedStock> {
    return this.feedStockModel.create(feedStock);
  }

  async generateReport(): Promise<string> {
    const data = await this.feedStockModel
      .find({ deletedAt: null })
      .populate(['brand']);

    if (!data) {
      throw new Error('feedstock not found.');
    }

    type FeedstockReport = {
      id: string;
      nome: string;
      marca: string;
      ncm: string;
      preço: number;
      icms: number;
      'preço s/ icms': number;
    };

    const csvData: FeedstockReport[] = [];

    data.forEach((feedStock) => {
      const brand = feedStock.brand as unknown as Brand;

      csvData.push({
        id: feedStock._id,
        nome: feedStock.name,
        marca: brand ? brand.name : '',
        ncm: feedStock.ncm,
        preço: feedStock.price,
        icms: feedStock.icms,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        'preço s/ icms': feedStock.priceWithoutIcms,
      });
    });

    return generateCsvString(csvData);
  }

  async paginate(
    queryParams: PaginatorDto,
  ): Promise<PaginatorInterface<FeedStock>> {
    const { limit, page, search, orderBy, order } = queryParams;

    const query = {};

    if (search) {
      query['$or'] = [{ name: { $regex: search, $options: 'i' } }];
    }

    query['deletedAt'] = [null];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.feedStockModel.paginate(query, {
      page,
      limit,
      sort: { [orderBy]: order },
      populate: ['brand'],
    });
  }

  async findOne(id: string): Promise<FeedStock> {
    return this.feedStockModel.findOne({ _id: id }).populate('brand');
  }

  async delete(id: string): Promise<FeedStock> {
    return softDelete<FeedStock>(this.feedStockModel, id);
  }
}
