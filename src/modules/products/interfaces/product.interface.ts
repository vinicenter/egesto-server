import { Document } from 'mongoose';
import { z } from 'nestjs-zod/z';
import { ProductModelSchema, ProductSchema } from '../schemas/product.schema';

export type ProductType = z.infer<typeof ProductSchema>;

type productModelType = z.infer<typeof ProductModelSchema>;
export interface ProductModelType extends productModelType, Document {}
