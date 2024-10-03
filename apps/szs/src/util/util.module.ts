import { Global, Module } from '@nestjs/common';
import { AESUtil } from './aes.util';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [AESUtil],
  exports: [AESUtil],
})
export class UtilModule { }