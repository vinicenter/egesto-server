import mongoose from 'mongoose';
import { z } from 'nestjs-zod/z';
import { toMongooseSchema } from 'mongoose-zod';

export const UserSchema = z.object({
  username: z.string().min(1).mongooseTypeOptions({ unique: true }),
  password: z.string().min(1).mongooseTypeOptions({ select: false }),
  name: z.string().min(1),
  email: z.string().email().mongooseTypeOptions({ unique: true }),
});

const UserSchemaZodMongoose = UserSchema.mongoose({
  schemaOptions: { collection: 'users', timestamps: true },
});

export const UserMongooseSchema = toMongooseSchema(UserSchemaZodMongoose);

// eslint-disable-next-line @typescript-eslint/no-var-requires
UserMongooseSchema.plugin(require('mongoose-paginate-v2'));

export const UserModel = mongoose.model('USER_MODEL', UserMongooseSchema);
