import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { InjectTenancyModel } from '@needle-innovision/nestjs-tenancy';
import { hash, compare } from 'bcrypt';
import { PaginatorDto } from 'src/utils/paginator/paginator.dto';
import { PaginatorInterface } from 'src/utils/paginator/paginator.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectTenancyModel('USER_MODEL') private readonly userModel: Model<User>,
  ) {}

  async findUserAndComparePassword(username: string, password: string) {
    const user = await this.userModel.findOne({ username }).select('+password');

    if (!user) {
      return false;
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      return false;
    }

    return user;
  }

  async update(id: string, user: UserDto) {
    const updatedUser = {
      name: user.name,
      username: user.username,
      email: user.email,
    };

    if (user.password) {
      updatedUser['password'] = await hash(user.password, 12);
    }

    return this.userModel.findOneAndUpdate({ _id: id }, updatedUser, {
      new: true,
    });
  }

  async create(user: UserDto): Promise<User> {
    const createdUser = {
      name: user.name,
      username: user.username,
      email: user.email,
      password: await hash(user.password, 12),
    };

    return this.userModel.create(createdUser);
  }

  async paginate(queryParams: PaginatorDto) {
    const { limit, page, search, orderBy, order } = queryParams;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.userModel.paginate(
      search
        ? {
            $or: [
              { username: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } },
              { name: { $regex: search, $options: 'i' } },
            ],
          }
        : {},
      {
        page,
        limit,
        sort: { [orderBy]: order },
      },
    ) as Promise<PaginatorInterface<User>>;
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id);
  }

  async findByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username });
  }

  async delete(id: string): Promise<User> {
    return this.userModel.findOneAndDelete({ _id: id });
  }
}
