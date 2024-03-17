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
import { billsQuery } from './utils/bills.utils';

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

  async summary(queryParams: BillPaginatorDto) {
    const query = billsQuery(queryParams);

    const count = await this.billModel.countDocuments(query);
    const bills = await this.billModel.find(query);

    const billsPaid = bills.filter((bill) => bill.isPaid);
    const billsUnpaid = bills.filter((bill) => !bill.isPaid);

    const billsPaidAmount = billsPaid.reduce(
      (acc, bill) => acc + bill.amount,
      0,
    );
    const billsUnpaidAmount = billsUnpaid.reduce(
      (acc, bill) => acc + bill.amount,
      0,
    );

    const billsAmount = billsPaidAmount + billsUnpaidAmount;

    return {
      billsCount: count,
      billsPaidAmount,
      billsUnpaidAmount,
      billsAmount,
    };
  }

  async paginate(
    queryParams: BillPaginatorDto,
  ): Promise<PaginatorInterface<Bill>> {
    const { page, limit, orderBy, order } = queryParams;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.billModel.paginate(billsQuery(queryParams), {
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
