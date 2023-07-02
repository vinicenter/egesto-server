import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { InjectTenancyModel } from '@needle-innovision/nestjs-tenancy';

@Injectable()
export class UsersService {
  constructor(
    @InjectTenancyModel('USER_MODEL') private readonly userModel: Model<User>,
  ) {}

  async update(id: string, user: UserDto) {
    return this.userModel.findOneAndUpdate({ _id: id }, user, { new: true });
  }

  async create(createUserDto: UserDto): Promise<User> {
    return this.userModel.create(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
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
