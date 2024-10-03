import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@szs/prisma/prisma.service';
import { AESUtil } from '@szs/util/aes.util';
import { WhiteListDTO } from './dto/white-list.dto';
import { AccountDTO } from './dto/account.dto';

@Injectable()
export class AuthService {
  constructor (
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly aesUtil: AESUtil
  ) { }

  async encrypt(text: string) {
    const iv: string = this.aesUtil.getIv();

    return {
      encryptedText: this.aesUtil.encrypt(text, iv),
      iv
    };
  }

  async decrypt(encryptedText: string, iv: string) {
    return this.aesUtil.decrypt(encryptedText, iv);
  }

  async login(accountDTO: AccountDTO) {
    const currentWhiteList: Array<WhiteListDTO> = (await this.prismaService.whiteList.findMany({
      select: {
        name: true,
        regNo: true,
        regNoIv: true
      },
      where: {
        name: accountDTO.name
      }
    })).map(WhiteListDTO.fromEntity);

    if (currentWhiteList.length === 0) {
      console.error('No matching white list found for user :', accountDTO.name);
      throw new Error('No matching white list found for user');
    }



    const payload = { userName: 'fedaykin', id: 1 };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('jwt.access.token.secret.key'),
        expiresIn: this.configService.get<number>('jwt.access.token.expiration.time')
      }),
    };
  }
}