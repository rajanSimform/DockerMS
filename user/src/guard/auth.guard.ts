import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';

export class AuthGuard implements CanActivate {
  constructor(@Inject('TOKEN_SERVICE') private tokenProxy: ClientProxy) {}

  // canActivate will return forbidon 403 on returning false
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // get request object from context
      const req = context.switchToHttp().getRequest<Request>();

      // check for token in authorization header
      const Authorization = req.headers['authorization'];
      if (!Authorization) {
        throw new UnauthorizedException('Missing Authorization Header');
      }
      const token = Authorization.replace('Bearer ', '');
      if (!token) {
        throw new UnauthorizedException();
      }

      // verify the token via auth service
      const result = await firstValueFrom(
        this.tokenProxy.send('varify_token', token),
      );

      if (result.id && result.email) {
        return true;
      } else if (result.message) {
        throw new UnauthorizedException(result.message);
      }

      return false;
    } catch (e) {
      // throw exception on error, it will set return to false
      throw new UnauthorizedException(e.message);
    }
  }
}
