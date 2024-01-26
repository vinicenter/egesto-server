import { z } from 'nestjs-zod/z';

export const FamilyDefaultCostSchema = z.object({
  costs: z.array(
    z
      .object({
        name: z.string(),
        value: z.number(),
      })
      .optional(),
  ),
});
