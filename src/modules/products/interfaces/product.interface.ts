import { Document } from 'mongoose';
import { z } from 'nestjs-zod/z';
import {
  ProductGenerateDescriptionAiSchema,
  ProductModelSchema,
  ProductSchema,
} from '../schemas/product.schema';

export type ProductType = z.infer<typeof ProductSchema>;

type productModelType = z.infer<typeof ProductModelSchema>;
export interface ProductModelType extends productModelType, Document {}

export type ProductDescriptionPromptParams = z.infer<
  typeof ProductGenerateDescriptionAiSchema
>;
