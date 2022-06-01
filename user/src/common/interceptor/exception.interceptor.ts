import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  async catch(exception: HttpException, host: ArgumentsHost) {
    // console.log(exception);

    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // let message = exception.message;
    let message = exception.getResponse();

    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      message = 'Internal server error';
    }
    response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}
