import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class AESUtil {
  private secretKey: string;
  private algorithm: string;

  constructor (private configService: ConfigService) {
    this.secretKey = this.configService.get<string>('aes.secret.key') || '';
    this.algorithm = this.configService.get<string>('aes.algorithm') || '';
  }

  encrypt(text: string, iv: string): string {
    try {
      const key = Buffer.from(this.secretKey, 'utf-8');
      const ivBuffer = Buffer.from(iv, 'base64');
      const cipher = crypto.createCipheriv(this.algorithm, key, ivBuffer);

      return Buffer.concat([cipher.update(text), cipher.final()]).toString('base64');
    } catch (e) {
      throw new Error((e as Error).message);
    }
  }

  decrypt(encryptedText: string, iv: string): string {
    try {
      const key = Buffer.from(this.secretKey, 'utf-8');
      const ivBuffer = Buffer.from(iv, 'base64');
      const decipher = crypto.createDecipheriv(this.algorithm, key, ivBuffer);

      return Buffer.concat([decipher.update(encryptedText, 'base64'), decipher.final()]).toString();
    } catch (e) {
      throw new Error((e as Error).message);
    }
  }

  getIv(): string {
    const iv = crypto.randomBytes(16);

    return iv.toString('base64');
  }
}