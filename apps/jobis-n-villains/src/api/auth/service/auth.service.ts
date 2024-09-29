import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor (
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async login() {
    const payload = { userName: 'fedaykin', id: 1 };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('jwt.access.token.secret.key'),
        expiresIn: this.configService.get<number>('jwt.access.token.expiration.time')
      }),
    };
  }
}