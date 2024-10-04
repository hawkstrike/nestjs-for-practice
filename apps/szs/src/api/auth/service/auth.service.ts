import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@szs/prisma/prisma.service';
import { AESUtil } from '@szs/util/aes.util';
import { WhiteListDTO } from './dto/white-list.dto';
import { AccountDTO } from './dto/account.dto';
import { compareSync, hashSync } from 'bcrypt';
import { AuthLoginResponseDTO } from '../controller/dto/auth-login-response.dto';

@Injectable()
export class AuthService {
  constructor (
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly aesUtil: AESUtil
  ) { }

  async findAll() {
    return await this.prismaService.account.findMany();
  }

  async signUp(accountDTO: AccountDTO): Promise<number> {
    const currentWhiteList: Array<WhiteListDTO> = (await this.prismaService.whiteList.findMany({
      select: {
        id: true,
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

    const whiteUser: WhiteListDTO | undefined = currentWhiteList.find(whiteUser => this.aesUtil.encrypt(accountDTO.regNo, whiteUser.regNoIv) === whiteUser.regNo);

    if (whiteUser) {
      console.error('No matching registration number found for user :', accountDTO.name);
      throw new Error('No matching registration number found for user');
    }

    await this.prismaService.account.findFirstOrThrow({ where: { userId: accountDTO.userId } })
      .catch(() => new Error('Duplicated user id found'));

    const encryptedPassword: string = this.hashPassword(accountDTO.password);
    const iv: string = this.aesUtil.getIv();
    const encryptedRegNo: string = this.aesUtil.encrypt(accountDTO.regNo, iv);

    const newAccount: AccountDTO = AccountDTO.fromEntity(await this.prismaService.account.create({
      data: {
        userId: accountDTO.userId,
        password: encryptedPassword,
        name: accountDTO.name,
        regNo: encryptedRegNo,
        regNoIv: iv
      }
    }));

    return newAccount.id;
  }

  async login(accountDTO: AccountDTO): Promise<AuthLoginResponseDTO> {
    const currentAccount: AccountDTO = await this.prismaService.account.findFirstOrThrow({ where: { userId: accountDTO.userId } })
      .then(account => AccountDTO.fromEntity(account))
      .catch(() => {
        throw new Error('No matching user found');
      });

    if (!this.comparePassword(accountDTO.password, currentAccount.password)) {
      console.error('No matching password found for user :', accountDTO.userId);

      throw new Error('No matching password found for user');
    }

    const payload = { userId: currentAccount.userId, name: currentAccount.name };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('jwt.access.token.secret.key'),
        expiresIn: this.configService.get<number>('jwt.access.token.expiration.time')
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('jwt.refresh.token.secret.key'),
        expiresIn: this.configService.get<number>('jwt.refresh.token.expiration.time')
      })
    } as AuthLoginResponseDTO;
  }

  private hashPassword(password: string): string {
    return hashSync(password, 10);
  }

  private comparePassword(currentPassword: string, hashedPassword: string): boolean {
    return compareSync(currentPassword, hashedPassword);
  }
}