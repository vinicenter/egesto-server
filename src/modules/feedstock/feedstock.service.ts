import { InjectTenancyModel } from '@needle-innovision/nestjs-tenancy';
import { Injectable } from '@nestjs/common';
import { FeedStock } from './interfaces/feedstock.interface';
import { Model } from 'mongoose';
import { CreateFeedStockDto } from './dto/create-feedstock.dto';
import { UpdateFeedStockDto } from './dto/update-feedstock.dto';

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

  async findAll(search: string, page = 1, limit = 20): Promise<FeedStock[]> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.feedStockModel.paginate(
      search ? { $or: [{ name: { $regex: search, $options: 'i' } }] } : {},
      {
        page,
        limit,
        populate: ['brand'],
      },
    );
  }

  async findOne(id: string): Promise<FeedStock> {
    return this.feedStockModel.findOne({ _id: id }).populate('brand');
  }

  async delete(id: string): Promise<FeedStock> {
    return this.feedStockModel.findOneAndDelete({ _id: id });
  }
}
