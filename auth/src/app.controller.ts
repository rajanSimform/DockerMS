import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Response } from 'express';
import { AppService } from './app.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';

const validDtoPipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
});

@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UsePipes(validDtoPipe)
  @Post('login')
  async userLogin(@Body() loginDto: LoginDto, @Res() res: Response) {
    const data = await this.appService.login(loginDto);

    res.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: 'OK',
      data,
    });
  }

  @UsePipes(validDtoPipe)
  @Post('signup')
  async userSignUp(@Body() signUpDto: SignUpDto) {
    return this.appService.signUp(signUpDto);
  }

  @MessagePattern('varify_token')
  async validateToken(@Payload() token: string) {
    return this.appService.varifyToken(token);
  }
}
