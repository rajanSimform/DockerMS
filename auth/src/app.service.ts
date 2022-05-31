import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    @Inject('USER_SERVICE') private userProxy: ClientProxy,
  ) {}
  private readonly expIn = this.configService.get<string>('EXP_IN');

  getHello(): string {
    return 'Auth service';
  }

  generateToken(user: any) {
    return this.jwtService.sign(
      { id: user._id, email: user.email },
      { expiresIn: this.expIn },
    );
  }

  varifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      return e;
    }
  }

  // filter user and attach token
  filterAndTokenize(user: any) {
    const { password, __v, ...dataToReturn } = user;
    const token = this.generateToken(user);
    return { user: dataToReturn, accessToken: token };
  }

  async login(loginDto: LoginDto) {
    const user = await firstValueFrom(
      this.userProxy.send('validate_user', loginDto),
    );

    if (user.status === 404) {
      throw new NotFoundException(user.message);
    } else if (user.status === 400) {
      throw new BadRequestException(user.message);
    }

    return this.filterAndTokenize(user);
  }

  async signUp(signUpDto: SignUpDto) {
    const user = await firstValueFrom(
      this.userProxy.send('create_user', signUpDto),
    );

    if (user.status === 409) {
      throw new HttpException('Email already exist', HttpStatus.CONFLICT);
    }

    return this.filterAndTokenize(user);
  }
}
