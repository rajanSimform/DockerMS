import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  private readonly expIn = this.configService.get<string>('EXP_IN');

  getHello(): string {
    return 'Auth service';
  }

  generateToken(user) {
    return this.jwtService.sign(
      { id: user._id, email: user.email },
      { expiresIn: this.expIn },
    );
  }
}
