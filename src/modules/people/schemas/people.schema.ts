import mongoose from 'mongoose';
import { z } from 'nestjs-zod/z';
import { toMongooseSchema } from 'mongoose-zod';
import { brazilianStates } from '../../../constants/states';

const states = brazilianStates.map((state) => state.value);

const cnpjCpfRegex = new RegExp(
  /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/,
);

export const PersonSchema = z.object({
  document: z
    .string()
    .max(18)
    .refine((value) => {
      return cnpjCpfRegex.test(value);
    }, 'Invalid document'),
  stateRegistration: z.string().min(0).max(13).optional(),
  corporateName: z.string(),
  fantasyName: z.string(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  observation: z.string().optional(),
  address: z
    .object({
      street: z.string().optional(),
      complement: z.string().optional(),
      number: z.string().optional(),
      neighborhood: z.string().optional(),
      city: z.string().optional(),
      federativeUnit: z.string().refine((value) => states.includes(value)),
      zipCode: z.string().optional(),
    })
    .optional(),
});

const PersonSchemaZodMongoose = PersonSchema.mongoose({
  schemaOptions: { collection: 'people', timestamps: true },
});

export const PersonMongooseSchema = toMongooseSchema(PersonSchemaZodMongoose);

// eslint-disable-next-line @typescript-eslint/no-var-requires
PersonMongooseSchema.plugin(require('mongoose-paginate-v2'));

export const PeopleModel = mongoose.model('PEOPLE_MODEL', PersonMongooseSchema);
