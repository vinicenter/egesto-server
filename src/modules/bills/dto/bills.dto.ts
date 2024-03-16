import { createZodDto } from 'nestjs-zod';
import { BillPaginatorSchema, BillSchema } from '../schemas/bills.schema';

const updateBillSchema = BillSchema.partial().strip();

export class UpdateBillDto extends createZodDto(updateBillSchema) {}
export class CreateBillDto extends createZodDto(BillSchema) {}
export class BillPaginatorDto extends createZodDto(BillPaginatorSchema) {}
