import { toMongooseSchema } from 'mongoose-zod';
import mongoose from 'mongoose';
import { ProductModelSchema } from '../schemas/product.schema';
import { calculateTotalCost } from '../products.repository';

const ProductSchemaZodMongoose = ProductModelSchema.mongoose({
  schemaOptions: {
    collection: 'products',
    timestamps: true,
    virtuals: {
      productionCost: {
        get() {
          return calculateTotalCost(this);
        },
      },
      packWeight: {
        get() {
          return this.unit.weight * this.pack.numberOfUnitsInPack;
        },
      },
    },
  },
});

export const ProductMongooseSchema = toMongooseSchema(ProductSchemaZodMongoose);

// eslint-disable-next-line @typescript-eslint/no-var-requires
ProductMongooseSchema.plugin(require('mongoose-paginate-v2'));

ProductMongooseSchema.set('toJSON', { virtuals: true });
ProductMongooseSchema.set('toObject', { virtuals: true });

export const ProductModel = mongoose.model(
  'PRODUCT_MODEL',
  ProductMongooseSchema,
);
