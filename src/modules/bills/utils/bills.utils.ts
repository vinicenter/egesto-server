import * as dayjs from 'dayjs';
import { BillPaginatorDto } from '../dto/bills.dto';

export const billsQuery = (queryParams: BillPaginatorDto) => {
  const query = {};

  if (queryParams.search) {
    query['$or'] = [
      { reference: { $regex: queryParams.search, $options: 'i' } },
      { observations: { $regex: queryParams.search, $options: 'i' } },
    ];
  }

  if (queryParams.recipient) {
    query['recipient'] = queryParams.recipient;
  }

  if (queryParams.isPaid !== undefined) {
    query['isPaid'] = queryParams.isPaid;
  }

  if (queryParams.startDueDate && queryParams.endDueDate) {
    query['dueDate'] = {
      $gte: dayjs(queryParams.startDueDate).startOf('day').toISOString(),
      $lte: dayjs(queryParams.endDueDate).endOf('day').toISOString(),
    };
  } else if (queryParams.startDueDate) {
    query['dueDate'] = {
      $gte: dayjs(queryParams.startDueDate).startOf('day').toISOString(),
    };
  } else if (queryParams.endDueDate) {
    query['dueDate'] = {
      $lte: dayjs(queryParams.endDueDate).endOf('day').toISOString(),
    };
  }

  if (queryParams.paymentMethod) {
    query['paymentMethod'] = queryParams.paymentMethod;
  }

  query['deletedAt'] = null;

  return query;
};
