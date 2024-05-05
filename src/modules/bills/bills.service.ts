import { InjectTenancyModel } from '@needle-innovision/nestjs-tenancy';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Bill } from './interfaces/bills.interface';
import {
  BillCumulativeReportDto,
  BillPaginatorDto,
  CreateBillDto,
  CreateBillTagDto,
  UpdateBillDto,
  UpdateBillTagDto,
} from './dto/bills.dto';
import { PaginatorInterface } from 'src/utils/paginator/paginator.interface';
import { softDelete } from 'src/utils/softDelete';
import * as dayjs from 'dayjs';
import { billsQuery } from './utils/bills.utils';
import { generateCsvString } from 'src/utils/generateCsvString';
import { People } from '../people/interfaces/people.interface';
import { BillTag } from './interfaces/billTags.interface';
import { PaginatorDto } from 'src/utils/paginator/paginator.dto';

@Injectable()
export class BillService {
  constructor(
    @InjectTenancyModel('BILL_MODEL')
    private readonly billModel: Model<Bill>,
    @InjectTenancyModel('BILL_TAG_MODEL')
    private readonly BillTagModel: Model<BillTag>,
  ) {}

  async paginateTags(
    queryParams: PaginatorDto,
  ): Promise<PaginatorInterface<Bill>> {
    const query = {};

    if (queryParams.search) {
      query['$or'] = [
        { name: { $regex: queryParams.search, $options: 'i' } },
        { description: { $regex: queryParams.search, $options: 'i' } },
      ];
    }

    query['deletedAt'] = null;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.BillTagModel.paginate(query, {
      page: queryParams.page,
      limit: queryParams.limit,
      sort: { title: 1 },
    });
  }

  async createTag(BillTag: CreateBillTagDto): Promise<BillTag> {
    return this.BillTagModel.create(BillTag);
  }

  async updateTag(id: string, BillTag: UpdateBillTagDto): Promise<BillTag> {
    return this.BillTagModel.findOneAndUpdate({ _id: id }, BillTag, {
      new: true,
    });
  }

  async deleteTag(id: string): Promise<BillTag> {
    return softDelete(this.BillTagModel, id);
  }

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

  async cumulativeReport(queryParams: BillCumulativeReportDto) {
    const query = billsQuery(queryParams);

    const startDateFormatted = dayjs(queryParams.startDate)
      .startOf('day')
      .toISOString();

    const endDateFormatted = dayjs(queryParams.endDate)
      .endOf('day')
      .toISOString();

    query['dueDate'] = { $gte: startDateFormatted, $lte: endDateFormatted };

    const bills = await this.billModel.find(query).sort({ dueDate: 1 });

    const valueAccumulativeByDay = bills.reduce<{
      [date: string]: {
        totalBills: number;
        paid: number;
        unpaid: number;
        accumulativePaid: number;
        accumulativeUnpaid: number;
      };
    }>((acc, bill) => {
      const billDate = dayjs(bill.dueDate).format('YYYY-MM-DD');

      const previousAcc = Object.values(acc)[Object.keys(acc).length - 1];

      const paid = bill.isPaid
        ? (acc[billDate]?.paid || 0) + bill.amount
        : (acc[billDate]?.paid || 0) + 0;

      const unpaid = !bill.isPaid
        ? (acc[billDate]?.unpaid || 0) + bill.amount
        : (acc[billDate]?.unpaid || 0) + 0;

      const accumulativePaid = bill.isPaid
        ? (previousAcc?.accumulativePaid || 0) + bill.amount
        : (previousAcc?.accumulativePaid || 0) + 0;

      const accumulativeUnpaid = !bill.isPaid
        ? (previousAcc?.accumulativeUnpaid || 0) + bill.amount
        : (previousAcc?.accumulativeUnpaid || 0) + 0;

      acc[billDate] = {
        totalBills: (acc[billDate]?.totalBills || 0) + 1,
        paid,
        unpaid,
        accumulativePaid,
        accumulativeUnpaid,
      };

      return acc;
    }, {});

    return valueAccumulativeByDay;
  }

  async export(queryParams: BillPaginatorDto): Promise<string> {
    const query = billsQuery(queryParams);

    const data = await this.billModel.find(query).populate(['recipient']);

    if (!data) {
      throw new Error('bills not found.');
    }

    type BillsExport = {
      id: string;
      vencimento: string;
      recebedor: string;
      'forma de pagamento': string;
      referencia: string;
      valor: number;
      observacoes: string;
      status: string;
    };

    const csvData: BillsExport[] = [];

    data.forEach((bill) => {
      const billReport = bill as Bill;

      const recepient = billReport.recipient as unknown as People;

      csvData.push({
        id: billReport._id,
        vencimento: dayjs(billReport.dueDate).format('DD/MM/YYYY'),
        'forma de pagamento': billReport.paymentMethod,
        valor: billReport.amount,
        recebedor: recepient?.corporateName,
        referencia: billReport.reference,
        observacoes: billReport.observations,
        status: billReport.isPaid ? 'Pago' : 'Não pago',
      });
    });

    return generateCsvString(csvData);
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
      populate: ['recipient', 'tags'],
    });
  }

  async findOne(id: string): Promise<Bill> {
    return this.billModel.findById(id).populate(['recipient', 'tags']);
  }

  async delete(id: string): Promise<Bill> {
    return softDelete(this.billModel, id);
  }
}
