import { Document } from 'mongoose';
import { Model } from 'mongoose';

export const softDelete = <T extends Document>(model: Model<T>, id: string) => {
  return model.findByIdAndUpdate(
    { _id: id },
    { deletedAt: new Date() },
    { returnDocument: 'before' },
  );
};
