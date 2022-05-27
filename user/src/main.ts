import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ResponseInterceptor } from './common/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const moduleRef = app.select(AppModule);
  const reflector = moduleRef.get(Reflector);
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));

  const configService = app.get(ConfigService);
  const APP_PORT = configService.get<string>('APP_PORT');
  await app.listen(APP_PORT, () => {
    console.log(`User Service is started on port : ${APP_PORT}`);
  });
}
bootstrap();
