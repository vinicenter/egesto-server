import { InjectTenancyModel } from '@needle-innovision/nestjs-tenancy';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Bill } from './interfaces/bills.interface';
import {
  BillPaginatorDto,
  CreateBillDto,
  UpdateBillDto,
} from './dto/bills.dto';
import { PaginatorInterface } from 'src/utils/paginator/paginator.interface';
import { softDelete } from 'src/utils/softDelete';
import * as dayjs from 'dayjs';

@Injectable()
export class BillService {
  constructor(
    @InjectTenancyModel('BILL_MODEL')
    private readonly billModel: Model<Bill>,
  ) {}

  async update(id: string, bill: UpdateBillDto): Promise<Bill> {
    return this.billModel.findOneAndUpdate({ _id: id }, bill, {
      new: true,
    });
  }

  async create(bill: CreateBillDto): Promise<Bill> {
    return this.billModel.create({
      ...bill,
      dueDate: dayjs(bill.dueDate).toISOString(),
    });
  }

  async paginate(
    queryParams: BillPaginatorDto,
  ): Promise<PaginatorInterface<Bill>> {
    const {
      page,
      limit,
      search,
      orderBy,
      order,
      isPaid,
      recipient,
      endDueDate,
      startDueDate,
      type,
    } = queryParams;

    const query = {};

    if (search) {
      query['$or'] = [
        { reference: { $regex: search, $options: 'i' } },
        { observations: { $regex: search, $options: 'i' } },
      ];
    }

    if (recipient) {
      query['recipient'] = recipient;
    }

    if (isPaid !== undefined) {
      query['isPaid'] = isPaid;
    }

    if (startDueDate && endDueDate) {
      query['dueDate'] = {
        $gte: dayjs(startDueDate).startOf('day').toISOString(),
        $lte: dayjs(endDueDate).endOf('day').toISOString(),
      };
    } else if (startDueDate) {
      query['dueDate'] = {
        $gte: dayjs(startDueDate).startOf('day').toISOString(),
      };
    } else if (endDueDate) {
      query['dueDate'] = {
        $lte: dayjs(endDueDate).endOf('day').toISOString(),
      };
    }

    if (type) {
      query['type'] = type;
    }

    query['deletedAt'] = null;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.billModel.paginate(query, {
      page,
      limit,
      sort: { [orderBy]: order },
      populate: ['recipient'],
    });
  }

  async findOne(id: string): Promise<Bill> {
    return this.billModel.findById(id).populate('recipient');
  }

  async delete(id: string): Promise<Bill> {
    return softDelete(this.billModel, id);
  }
}
