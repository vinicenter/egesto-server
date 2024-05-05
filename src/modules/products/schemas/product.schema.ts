import mongoose from 'mongoose';
import { z } from 'nestjs-zod/z';
import { PaginatorSchema } from 'src/utils/paginator/paginator.schema';

export const ProductModelSchema = z.object({
  externalId: z.string().optional(),
  name: z.string(),
  code: z
    .string()
    .optional()
    .mongooseTypeOptions({ unique: true, required: false }),
  UnitOfMeasurement: z.string().max(3).optional(),
  pack: z.object({
    numberOfUnitsInPack: z.number(),
    numberOfPacksInPallet: z.number().optional(),
    barcodeDun14: z.string().optional(),
  }),
  unit: z.object({
    weight: z.number(),
    barcodeEan13: z.string().optional(),
  }),
  marketing: z
    .object({
      description: z.string().optional(),
      color: z.string().optional(),
      isPublic: z.boolean().optional(),
      photo: z.string().optional(),
    })
    .optional(),
  production: z
    .object({
      lost: z.number().optional(),
      useCustomPackCostMultiplier: z.number().optional(),
      canBeFeedstock: z.boolean().optional(),
      formulation: z.object({
        feedstocks: z.array(
          z
            .object({
              feedstock: z
                .string()
                .refine((val) => mongoose.Types.ObjectId.isValid(val))
                .mongooseTypeOptions({ ref: 'FEEDSTOCK_MODEL' }),
              value: z.number(),
              considerInWeightCalculation: z.boolean(),
              considerInVolumeProduced: z.boolean(),
            })
            .optional(),
        ),
        products: z.array(
          z.object({
            product: z
              .string()
              .refine((val) => mongoose.Types.ObjectId.isValid(val))
              .mongooseTypeOptions({ ref: 'PRODUCT_MODEL' }),
            value: z.number(),
            considerInWeightCalculation: z.boolean(),
            considerInVolumeProduced: z.boolean(),
          }),
        ),
      }),
    })
    .optional(),
  taxes: z
    .object({
      ncm: z.string().optional(),
      cest: z.string().optional(),
    })
    .optional(),
  family: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val))
    .mongooseTypeOptions({ ref: 'FAMILY_MODEL' })
    .nullish(),
  brand: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val))
    .mongooseTypeOptions({ ref: 'BRAND_MODEL' })
    .nullish(),
  deletedAt: z.string().optional(),
});

export const ProductSchema = ProductModelSchema.and(
  z.object({
    packWeight: z.number(),
    productionCost: z.object({
      unitCost: z.number(),
      packCost: z.number(),
      weightPerFormulation: z.number(),
      isWeightPerFormulationValid: z.boolean(),
    }),
  }),
);

export const ProductPaginatorSchema = PaginatorSchema.and(
  z.object({
    feedstockId: z.string().optional(),
    brandId: z.string().optional(),
    familyId: z.string().optional(),
    withFamily: z
      .string()
      .optional()
      .transform((value) => value === 'true'),
    onlyFeedstockEnabled: z
      .string()
      .optional()
      .transform((value) => value === 'true'),
  }),
);

export const ProductGenerateDescriptionAiSchema = z.object({
  productName: z.string().optional(),
  productFamily: z.string().optional(),
  brandName: z.string().optional(),
  brandDescription: z.string().optional(),
  oldProductDescription: z.string().optional(),
});
