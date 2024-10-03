import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor (
    private readonly authService: AuthService,
  ) { }

  @Get()
  async encrypt(@Query('text') text: string) {
    const { encryptedText, iv } = await this.authService.encrypt(text);
    const decryptedText = await this.authService.decrypt(encryptedText, iv);

    return { encryptedText, iv, decryptedText };
  }
}