import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserSignUpDto } from './dto/userSignup.dto';
import { UserDocument } from './schema/user.schema';
import { hash, compare } from 'bcrypt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserLoginDto } from './dto/userLogin.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly user: Model<UserDocument>,
    @Inject('TOKEN_SERVICE') private tokenProxy: ClientProxy,
  ) {}

  async getAllUsers() {
    return await this.user.find({});
  }

  private async findUserByEmail(email: string) {
    return this.user.findOne({ email });
  }

  async createUser(userSignUpDto: UserSignUpDto) {
    try {
      const { email, password } = userSignUpDto;

      const exists = await this.findUserByEmail(email);
      if (exists) {
        throw new HttpException('Email already exist', HttpStatus.CONFLICT);
      }

      const hashedPassword = await hash(password, 10);

      const newUser = await this.user.create({
        ...userSignUpDto,
        password: hashedPassword,
      });

      return newUser.toJSON();
    } catch (e) {
      return e;
    }
  }

  async validateUser(loginDto: UserLoginDto) {
    try {
      const { email, password } = loginDto;
      const user = await this.findUserByEmail(email);
      if (!user) {
        throw new NotFoundException('User Not Found');
      }
      const passwordHash = user.password;
      if (!(await compare(password, passwordHash))) {
        throw new BadRequestException('Incorrect Password');
      }

      return user.toJSON();
    } catch (e) {
      return e;
    }
  }

  async deleteUserById(id: string) {
    const result = await this.user.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('User Not Found');
    }

    return result.toJSON();
  }
}
