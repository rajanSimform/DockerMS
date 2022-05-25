import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const APP_PORT = configService.get<string>('APP_PORT');

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@rabbitmq:5672'],
      queue: 'main_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  try {
    await app.startAllMicroservices();
  } catch (e) {
    console.log(e);
  }

  await app.listen(APP_PORT, () => {
    console.log(`Admin Service is started on port : ${APP_PORT}`);
  });
}
bootstrap();
