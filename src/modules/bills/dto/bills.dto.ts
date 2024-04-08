import { createZodDto } from 'nestjs-zod';
import {
  BillCumulativeReportSchema,
  BillPaginatorSchema,
  BillSchema,
} from '../schemas/bills.schema';
import { BillTagschema } from '../schemas/billTags.schema';

const updateBillSchema = BillSchema.partial().strip();

export class UpdateBillDto extends createZodDto(updateBillSchema) {}
export class CreateBillDto extends createZodDto(BillSchema) {}
export class BillPaginatorDto extends createZodDto(BillPaginatorSchema) {}
export class BillCumulativeReportDto extends createZodDto(
  BillCumulativeReportSchema,
) {}

export class UpdateBillTagDto extends createZodDto(
  BillTagschema.partial().strip(),
) {}
export class CreateBillTagDto extends createZodDto(BillTagschema) {}
