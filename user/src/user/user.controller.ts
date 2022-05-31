import { Controller, Get, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserLoginDto } from './dto/userLogin.dto';
import { UserSignUpDto } from './dto/userSignup.dto';
import { UserService } from './user.service';

// const validDtoPipe = new ValidationPipe({
//   whitelist: true,
//   forbidNonWhitelisted: true,
// });

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  getUsers() {
    return this.userService.getAllUsers();
  }

  @MessagePattern('create_user')
  async userSignUp(@Payload() userSignupDto: UserSignUpDto) {
    return await this.userService.createUser(userSignupDto);
  }

  @MessagePattern('validate_user')
  async validateUser(@Payload() payload: UserLoginDto) {
    return await this.userService.validateUser(payload);
  }
}
