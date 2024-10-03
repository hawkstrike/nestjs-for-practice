import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { ConfigModule } from '@nestjs/config';
import { UtilModule } from './util/util.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), ApiModule, PrismaModule, UtilModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
