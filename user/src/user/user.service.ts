import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import { UserDocument } from './schema/user.schema';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly user: Model<UserDocument>,
  ) {}

  async getAllUsers() {
    return await this.user.find({});
  }

  private async findUserByEmail(email: string) {
    return this.user.findOne({ email });
  }

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const hashedPassword = await hash(password, 10);

    const exists = await this.findUserByEmail(email);
    console.log('exists ? =', exists);
    if (exists) {
      throw new HttpException('Email already exist', HttpStatus.CONFLICT);
    }

    const newUser = await this.user.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // delete newUser.password;
    const { password: p, ...dataToReturn } = newUser.toJSON();
    return dataToReturn;
  }
}
