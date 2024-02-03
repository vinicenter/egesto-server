import { InjectTenancyModel } from '@needle-innovision/nestjs-tenancy';
import { Injectable } from '@nestjs/common';
import { People } from './interfaces/people.interface';
import { Model } from 'mongoose';
import { PeopleDto } from './dto/create-people.dto';
import { PaginatorDto } from 'src/utils/paginator/paginator.dto';
import { PaginatorInterface } from 'src/utils/paginator/paginator.interface';
import { generateCsvString } from 'src/utils/generateCsvString';
import { softDelete } from 'src/utils/softDelete';

@Injectable()
export class PeopleService {
  constructor(
    @InjectTenancyModel('PEOPLE_MODEL')
    private readonly peopleModel: Model<People>,
  ) {}

  async update(id: string, people: PeopleDto): Promise<People> {
    return this.peopleModel.findOneAndUpdate({ _id: id }, people, {
      new: true,
    });
  }

  async generateReport(): Promise<string> {
    const data = await this.peopleModel.find({ deletedAt: null });

    if (!data) {
      throw new Error('people not found.');
    }

    type PeopleReport = {
      id: string;
      nome: string;
      fantasia: string;
      'cnpj / cpf': string;
      'inscrição estadual': string;
      rua: string;
      numero: string;
      bairro: string;
      municipio: string;
      uf: string;
      cep: string;
      telefone: string;
      email: string;
      contrato: number;
      observacao: string;
    };

    const csvData: PeopleReport[] = [];

    data.forEach((person) => {
      csvData.push({
        id: person._id,
        nome: person.corporateName,
        fantasia: person.fantasyName,
        'cnpj / cpf': person.document,
        'inscrição estadual': person.stateRegistration,
        rua: person.address.street,
        numero: person.address.number,
        bairro: person.address.neighborhood,
        municipio: person.address.city,
        uf: person.address.federativeUnit,
        cep: person.address.zipCode,
        telefone: person.phone,
        email: person.email,
        contrato: person.contractExpenses,
        observacao: person.observation,
      });
    });

    return generateCsvString(csvData);
  }

  async create(people: PeopleDto): Promise<People> {
    return this.peopleModel.create(people);
  }

  async paginate(queryParams: PaginatorDto) {
    const { limit, page, search, orderBy, order } = queryParams;

    const query = {};

    if (search) {
      query['$or'] = [
        { document: { $regex: search, $options: 'i' } },
        { fantasyName: { $regex: search, $options: 'i' } },
        { corporateName: { $regex: search, $options: 'i' } },
      ];
    }

    query['deletedAt'] = null;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.peopleModel.paginate(query, {
      page,
      limit,
      sort: { [orderBy]: order },
    }) as Promise<PaginatorInterface<People>>;
  }

  async findOne(id: string): Promise<People> {
    return this.peopleModel.findById(id);
  }

  async delete(id: string): Promise<People> {
    return softDelete(this.peopleModel, id);
  }
}
