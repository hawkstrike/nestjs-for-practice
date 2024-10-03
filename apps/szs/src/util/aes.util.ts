import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class AESUtil {
  private secretKey: string;
  private algorithm: string;

  constructor (private configService: ConfigService) {
    this.secretKey = this.configService.get<string>('aes.secret.key');
    this.algorithm = this.configService.get<string>('aes.algorithm');
  }

  encrypt(text: string, iv: string): string {
    try {
      const key = Buffer.from(this.secretKey, 'utf-8');
      const ivBuffer = Buffer.from(iv, 'base64');
      const cipher = crypto.createCipheriv(this.algorithm, key, ivBuffer);
      /* let encrypted = cipher.update(text, 'utf-8', 'base64');
      encrypted += cipher.final('base64');
      return encrypted; */

      return Buffer.concat([cipher.update(text), cipher.final()]).toString('base64');
    } catch (e) {
      throw new Error(e.message);
    }
  }

  decrypt(encryptedText: string, iv: string): string {
    try {
      const key = Buffer.from(this.secretKey, 'utf-8');
      const ivBuffer = Buffer.from(iv, 'base64');
      const decipher = crypto.createDecipheriv(this.algorithm, key, ivBuffer);
      /* let decrypted = decipher.update(encryptedText, 'base64', 'utf-8');
      decrypted += decipher.final('utf-8');
      return decrypted; */

      return Buffer.concat([decipher.update(encryptedText, 'base64'), decipher.final()]).toString();
    } catch (e) {
      throw new Error(e.message);
    }
  }

  getIv(): string {
    const iv = crypto.randomBytes(16);

    return iv.toString('base64');
  }
}