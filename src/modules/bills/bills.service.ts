import { InjectTenancyModel } from '@needle-innovision/nestjs-tenancy';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Bill } from './interfaces/bills.interface';
import {
  BillCumulativeReportDto,
  BillDailyReportDto,
  BillPaginatorDto,
  CreateBillDto,
  CreateBillInstallmentDto,
  CreateBillTagDto,
  UpdateBillDto,
  UpdateBillInstallmentDto,
  UpdateBillTagDto,
} from './dto/bills.dto';
import { PaginatorInterface } from 'src/utils/paginator/paginator.interface';
import { softDelete } from 'src/utils/softDelete';
import * as dayjs from 'dayjs';
import { billsDailyReport, billsQuery } from './utils/bills.utils';
import { generateCsvString } from 'src/utils/generateCsvString';
import { People } from '../people/interfaces/people.interface';
import { BillTag } from './interfaces/billTags.interface';
import { PaginatorDto } from 'src/utils/paginator/paginator.dto';
import { BillInstallment } from './interfaces/billInstallment.interface';
import { formatPrice } from 'src/utils/formatters';

@Injectable()
export class BillService {
  constructor(
    @InjectTenancyModel('BILL_MODEL')
    private readonly billModel: Model<Bill>,
    @InjectTenancyModel('BILL_TAG_MODEL')
    private readonly BillTagModel: Model<BillTag>,
    @InjectTenancyModel('BILL_INSTALLMENT_MODEL')
    private readonly BillInstallmentModel: Model<BillInstallment>,
  ) {}

  async createInstallment(billInstallment: CreateBillInstallmentDto) {
    const installmentCreated = await this.BillInstallmentModel.create({
      name: billInstallment.name,
      observations: billInstallment.observations,
      paymentMethod: billInstallment.paymentMethod,
      recipient: billInstallment.recipient,
      tags: billInstallment.tags,
    });

    const billsToCreate: CreateBillDto[] = billInstallment.bills.map(
      (bill): CreateBillDto => ({
        amount: bill.amount,
        dueDate: dayjs(bill.dueDate).toISOString(),
        isPaid: bill.isPaid,
        reference: bill.reference,
        paymentMethod: billInstallment.paymentMethod,
        observations: billInstallment.observations,
        recipient: billInstallment.recipient,
        tags: billInstallment.tags,
        installment: installmentCreated._id.toString(),
      }),
    );

    const billsCreated = await this.billModel.create(...billsToCreate);

    return {
      ...installmentCreated.toObject(),
      bills: billsCreated,
    };
  }

  async updateInstallment(
    installmentId: string,
    billInstallment: UpdateBillInstallmentDto,
  ) {
    const installment = await this.BillInstallmentModel.findOneAndUpdate(
      { _id: installmentId },
      {
        name: billInstallment.name,
        observations: billInstallment.observations,
        paymentMethod: billInstallment.paymentMethod,
        recipient: billInstallment.recipient,
        tags: billInstallment.tags,
      },
      {
        new: true,
      },
    );

    const billsAlreadySaved = await this.billModel.find({
      installment: installmentId,
      deletedAt: null,
    });

    const bills = billInstallment.bills.map((bill) => {
      return {
        ...bill,
        paymentMethod: billInstallment.paymentMethod,
        observations: billInstallment.observations,
        recipient: billInstallment.recipient,
        tags: billInstallment.tags,
      };
    });

    const billsToUpdate = bills.filter((bill) => !!bill._id);
    const billsToCreate = bills.filter((bill) => !bill._id);
    const billsToDelete = billsAlreadySaved.filter((billSaved) => {
      return (
        bills.find((bill) => bill._id === billSaved._id.toString()) ===
        undefined
      );
    });

    for (const bill of billsToUpdate) {
      await this.billModel.updateOne({ _id: bill._id.toString() }, bill);
    }

    for (const bill of billsToCreate) {
      await this.billModel.create({
        ...bill,
        dueDate: dayjs(bill.dueDate).toISOString(),
        installment: installmentId,
      });
    }

    for (const bill of billsToDelete) {
      await softDelete(this.billModel, bill._id);
    }

    return {
      ...installment.toObject(),
      bills: bills,
    };
  }

  async getInstallment(id: string) {
    const installment = await this.BillInstallmentModel.findById(id).populate([
      'recipient',
      'tags',
    ]);

    if (!installment) {
      throw new Error('Installment not found.');
    }

    const bills = await this.billModel
      .find({
        installment: id,
        deletedAt: null,
      })
      .sort({
        dueDate: 1,
      });

    return {
      ...installment.toObject(),
      bills,
    };
  }

  async deleteInstallment(id: string) {
    const installmentDeleted = await softDelete(this.BillInstallmentModel, id);

    await this.billModel.updateMany(
      { installment: id },
      {
        deletedAt: new Date(),
      },
    );

    return installmentDeleted;
  }

  async paginateInstallment(
    queryParams: PaginatorDto,
  ): Promise<PaginatorInterface<BillInstallment>> {
    const query = {};

    if (queryParams.search) {
      query['$or'] = [
        { name: { $regex: queryParams.search, $options: 'i' } },
        { observations: { $regex: queryParams.search, $options: 'i' } },
      ];
    }

    query['deletedAt'] = null;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.BillInstallmentModel.paginate(query, {
      page: queryParams.page,
      limit: queryParams.limit,
      sort: { title: 1 },
    });
  }

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

  async updateBill(id: string, bill: UpdateBillDto): Promise<Bill> {
    return this.billModel.findOneAndUpdate({ _id: id }, bill, {
      new: true,
    });
  }

  async createBill(bill: CreateBillDto): Promise<Bill> {
    return this.billModel.create({
      ...bill,
      dueDate: dayjs(bill.dueDate).toISOString(),
      installment: undefined,
    });
  }

  async findOneBill(id: string): Promise<Bill> {
    return this.billModel
      .findById(id)
      .populate(['recipient', 'tags', 'installment']);
  }

  async deleteBill(id: string): Promise<Bill> {
    const billSaved = await this.billModel.findById(id);

    if (billSaved.installment) {
      throw new Error('Cannot update a bill that is part of an installment.');
    }

    return softDelete(this.billModel, id);
  }

  async paginateBills(
    queryParams: BillPaginatorDto,
  ): Promise<PaginatorInterface<Bill>> {
    const { page, limit, orderBy, order } = queryParams;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.billModel.paginate(billsQuery(queryParams), {
      page,
      limit,
      sort: { [orderBy]: order },
      populate: ['recipient', 'tags', 'installment'],
    });
  }

  async export(queryParams: BillPaginatorDto): Promise<string> {
    const query = billsQuery(queryParams);

    const data = await this.billModel
      .find(query)
      .populate(['recipient', 'tags', 'installment']);

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

  async dailyReport(queryParams: BillDailyReportDto) {
    return billsDailyReport(queryParams, this.billModel);
  }

  async dailyReportCsv(queryParams: BillDailyReportDto) {
    const dailyReport = await this.dailyReport(queryParams);

    const csvData = dailyReport.map((report) => {
      const tags = report.values.reduce<Record<string, string>>(
        (acc, value) => {
          return {
            ...acc,
            [value.tag.name]: formatPrice(value.amount),
          };
        },
        {},
      );

      return {
        'Data de vencimento': dayjs(report.date).format('DD/MM/YYYY'),
        ...tags,
      };
    });

    return generateCsvString(csvData);
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
}
