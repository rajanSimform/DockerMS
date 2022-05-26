import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('USER_PROXY') private userServiceProxy: ClientProxy,
  ) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('test')
  sendHello(@Body() body: any) {
    console.log('Data in User service', body);
    this.userServiceProxy.emit('sample_test', body);
  }
}
