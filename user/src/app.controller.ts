import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller('user')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('USER_SERVICE') private userServiceProxy: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  sendHello(@Body() body: any) {
    console.log('Data in User service', body);
    this.userServiceProxy.emit('sample_test', body);
  }
}
