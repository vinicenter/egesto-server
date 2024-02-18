import { InjectTenancyModel } from '@needle-innovision/nestjs-tenancy';
import { Injectable } from '@nestjs/common';
import { Family, FamiliesDefaultCost } from './interfaces/families.interface';
import { Model } from 'mongoose';
import {
  FamilyDefaultCostDto,
  FamilyDto,
  FamilyPaginateDto,
} from './dto/create-families.dto';
import { PaginatorInterface } from 'src/utils/paginator/paginator.interface';
import { softDelete } from 'src/utils/softDelete';

@Injectable()
export class FamilyService {
  constructor(
    @InjectTenancyModel('FAMILY_MODEL')
    private readonly familyModel: Model<Family>,
    @InjectTenancyModel('FAMILIES_DEFAULT_COST_MODEL')
    private readonly familyDefaultCostModel: Model<FamiliesDefaultCost>,
  ) {}

  async update(id: string, feedStock: FamilyDto): Promise<Family> {
    return this.familyModel.findOneAndUpdate({ _id: id }, feedStock, {
      new: true,
    });
  }

  async create(feedStock: FamilyDto): Promise<Family> {
    return this.familyModel.create(feedStock);
  }

  async paginate(
    queryParams: FamilyPaginateDto,
  ): Promise<PaginatorInterface<Family>> {
    const { page, limit, search, orderBy, order, familyType, mainFamily } =
      queryParams;

    const query = {};

    if (search) {
      query['$or'] = [{ name: { $regex: search, $options: 'i' } }];
    }

    if (familyType === 'main') {
      query['linkedFamily'] = null;
    } else if (familyType === 'linked') {
      query['linkedFamily'] = { $ne: null };
    }

    if (mainFamily) {
      query['linkedFamily'] = mainFamily;
    }

    query['deletedAt'] = null;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.familyModel.paginate(query, {
      page,
      limit,
      sort: { [orderBy]: order },
      populate: ['linkedFamily'],
    });
  }

  async findOne(id: string): Promise<Family> {
    return this.familyModel.findOne({ _id: id }).populate({
      path: 'linkedFamily',
      populate: {
        path: 'linkedFamily',
      },
    });
  }

  async delete(id: string): Promise<Family> {
    return softDelete(this.familyModel, id);
  }

  async updateDefaultCosts(
    data: FamilyDefaultCostDto,
  ): Promise<FamiliesDefaultCost> {
    let defaultCosts = await this.familyDefaultCostModel.find();

    if (!defaultCosts.length) {
      const createdDefaultCost = await this.familyDefaultCostModel.create({
        costs: [],
      });

      defaultCosts = [createdDefaultCost];
    }

    const defaultCostsId = defaultCosts[0]._id;

    return this.familyDefaultCostModel.findOneAndUpdate(
      {
        _id: defaultCostsId,
      },
      data,
      { new: true },
    );
  }

  async getDefaultCosts(): Promise<FamiliesDefaultCost> {
    const defaultCosts = await this.familyDefaultCostModel.find();

    if (!defaultCosts.length) {
      const createdDefaultCost = await this.familyDefaultCostModel.create({
        costs: [],
      });

      return createdDefaultCost;
    }

    return defaultCosts[0];
  }
}
