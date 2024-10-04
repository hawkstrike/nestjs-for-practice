import { TypedBody, TypedRoute } from '@nestia/core';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AccountDTO } from '../service/dto/account.dto';
import { AuthLoginRequestDTO } from './dto/auth-login-request.dto';
import { AuthSignUpRequestDTO } from './dto/auth-sign-up-request.dto';

@Controller('auth')
export class AuthController {
  constructor (
    private readonly authService: AuthService,
  ) { }

  @Get()
  async findAll() {
    return this.authService.findAll();
  }

  @TypedRoute.Post('sign-up')
  async signUp(@TypedBody() authSignUpRequestDTO: AuthSignUpRequestDTO) {
    return this.authService.signUp(AccountDTO.of({ ...authSignUpRequestDTO } as AuthSignUpRequestDTO));
  }

  @Post('login')
  async login(@Body() authLoginRequestDTO: AuthLoginRequestDTO) {
    return this.authService.login(AccountDTO.of(authLoginRequestDTO));
  }
}