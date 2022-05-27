import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { Response } from 'express';
import { UserLoginDto } from './dto/userLogin.dto';
import { UserSignUpDto } from './dto/userSignup.dto';
import { UserService } from './user.service';

const validDtoPipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
});

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getAllUsers();
  }

  @UsePipes(validDtoPipe)
  @Post()
  async userSignUp(@Body() userSignupDto: UserSignUpDto) {
    return await this.userService.signUp(userSignupDto);
  }

  @UsePipes(validDtoPipe)
  @Post('login')
  async userLogin(@Body() userLoginDto: UserLoginDto, @Res() res: Response) {
    const data = await this.userService.login(userLoginDto);
    res.status(HttpStatus.OK).send(data);
  }
}
