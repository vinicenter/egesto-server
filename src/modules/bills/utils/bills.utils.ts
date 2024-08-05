import * as dayjs from 'dayjs';
import { BillDailyReportDto, BillPaginatorDto } from '../dto/bills.dto';
import { BillTag } from '../interfaces/billTags.interface';
import { Bill } from '../interfaces/bills.interface';
import { Model } from 'mongoose';

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

  if (queryParams.installment) {
    query['installment'] = queryParams.installment;
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

  if (queryParams.paymentMethod?.length) {
    query['paymentMethod'] = { $in: queryParams.paymentMethod };
  }

  if (queryParams.tags?.length) {
    if (queryParams.tagsFilterType === 'AND') {
      query['tags'] = { $all: queryParams.tags };
    } else {
      query['tags'] = { $in: queryParams.tags };
    }
  }

  query['deletedAt'] = null;

  return query;
};

export const billsDailyReport = async (
  queryParams: BillDailyReportDto,
  billModel: Model<Bill>,
) => {
  const query = billsQuery(queryParams);

  const startDateFormatted = dayjs(queryParams.startDate)
    .startOf('day')
    .toISOString();

  const endDateFormatted = dayjs(queryParams.endDate)
    .endOf('day')
    .toISOString();

  query['dueDate'] = { $gte: startDateFormatted, $lte: endDateFormatted };

  const bills = await billModel
    .find(query)
    .sort({ dueDate: 1 })
    .populate(['tags']);

  const valuesByDay = bills.reduce<{
    [date: string]: { [tagId: string]: { tag: BillTag; amount: number } };
  }>((acc, bill) => {
    const dueDate = dayjs(bill.dueDate).format('YYYY-MM-DD');

    if (!acc[dueDate]) {
      acc[dueDate] = {};
    }

    const tags = bill.tags as unknown as BillTag[] | undefined;

    if (!tags?.length) {
      return acc;
    }

    const addOrIncreaseAmountAcc = () => {
      tags.forEach((tag) => {
        const dontHasTagInAcc = !acc[dueDate][tag._id];

        if (dontHasTagInAcc) {
          acc[dueDate][tag._id] = {
            tag,
            amount: 0,
          };
        }

        acc[dueDate][tag._id].amount += bill.amount;
      });

      return acc;
    };

    return addOrIncreaseAmountAcc();
  }, {});

  const valuesByDayToArray = () => {
    return Object.keys(valuesByDay).map((date) => {
      return {
        date,
        values: valuesByDay[date],
      };
    });
  };

  const valuesByDayNormalized = () => {
    const values = valuesByDayToArray();

    const totalTags = (): BillTag[] => {
      return values.reduce<BillTag[]>((acc, value) => {
        const tags = Object.values(value.values).map((tag) => tag.tag);

        const tagsNotInAcc = tags.filter(
          (tag) => !acc.find((tagAcc) => tagAcc._id === tag._id),
        );

        if (tagsNotInAcc.length) {
          return [...acc, ...tagsNotInAcc];
        }

        return acc;
      }, []);
    };

    return values.map((value) => {
      const largestValue = totalTags();

      const normalizedValues = largestValue.map((tag) => {
        const valueTag = value.values[tag._id];

        if (!valueTag) {
          return {
            tag,
            amount: 0,
          };
        }

        return valueTag;
      });

      return {
        date: value.date,
        values: normalizedValues,
      };
    });
  };

  return valuesByDayNormalized();
};
