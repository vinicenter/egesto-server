import { toMongooseSchema } from 'mongoose-zod';
import mongoose from 'mongoose';
import { ProductModelSchema } from '../schemas/product.schema';

const ProductSchemaZodMongoose = ProductModelSchema.mongoose({
  schemaOptions: {
    collection: 'products',
    timestamps: true,
  },
});

export const ProductMongooseSchema = toMongooseSchema(ProductSchemaZodMongoose);

// eslint-disable-next-line @typescript-eslint/no-var-requires
ProductMongooseSchema.plugin(require('mongoose-paginate-v2'));

export const ProductModel = mongoose.model(
  'PRODUCT_MODEL',
  ProductMongooseSchema,
);
