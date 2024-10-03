import { Controller, Get, Param } from '@nestjs/common';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor (
    private readonly authService: AuthService,
  ) { }

  @Get()
  async encrypt(@Param('text') text: string) {
    const { encryptedText, iv } = await this.authService.encrypt(text);

    console.log('encryptedText :', encryptedText);
    console.log('iv :', iv);

    const decryptedText = await this.authService.decrypt(encryptedText, iv);

    console.log('decryptedText :', decryptedText);

    return true;
  }
}