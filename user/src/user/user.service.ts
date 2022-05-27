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

  private async comparePswd(password: string, passwordHash: string) {
    return await compare(password, passwordHash);
  }

  async signUp(userSignUpDto: UserSignUpDto) {
    const { email, password } = userSignUpDto;
    const hashedPassword = await hash(password, 10);

    const exists = await this.findUserByEmail(email);
    if (exists) {
      throw new HttpException('Email already exist', HttpStatus.CONFLICT);
    }

    const newUser = await this.user.create({
      ...userSignUpDto,
      password: hashedPassword,
    });

    const generatedToken: string = await firstValueFrom(
      this.tokenProxy.send('generateToken', newUser.toJSON()),
    );
    // console.log('token from auth service = ', generatedToken);

    const { password: p, __v, ...filteredUser } = newUser.toJSON();

    return {
      user: filteredUser,
      accessToken: generatedToken,
    };
  }

  async login(userLoginDto: UserLoginDto) {
    const { email, password } = userLoginDto;
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const passwordHash = user.password;
    if (!(await compare(password, passwordHash))) {
      throw new BadRequestException('Incorrect Password');
    }
    const generatedToken: string = await firstValueFrom(
      this.tokenProxy.send('generateToken', user.toJSON()),
    );
    const { password: p, __v, ...filteredUser } = user.toJSON();

    return {
      user: filteredUser,
      accessToken: generatedToken,
    };
  }
}
