import { z } from 'nestjs-zod/z';

export const PaginatorSchema = z.object({
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('10').transform(Number),
  search: z.string().optional(),
  orderBy: z.string().optional(),
  order: z
    .union([z.literal('ASC'), z.literal('DESC')])
    .default('ASC')
    .transform((value) => {
      if (value === 'ASC') {
        return 1;
      }

      return -1;
    }),
});
