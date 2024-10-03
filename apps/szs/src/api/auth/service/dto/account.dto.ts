import { Account } from '@prisma/client';
import { AuthLoginRequestDTO } from '../../controller/dto/auth-login-request.dto';
import { AuthSignUpRequestDTO } from '../../controller/dto/auth-sign-up-request.dto';

export class AccountDTO {
  id: number;
  userId: string;
  password: string;
  name: string;
  regNo: string;
  regNoIv: string;
  isActivated: boolean;
  createDate: string;
  updateDate: string;

  static of(dto: AuthSignUpRequestDTO | AuthLoginRequestDTO): AccountDTO {
    if (dto instanceof AuthSignUpRequestDTO) {
      return {
        userId: dto.userId.trim(),
        password: dto.password.trim(),
        name: dto.name.trim(),
        regNo: dto.regNo.trim(),
      } as AccountDTO;
    } else if (dto instanceof AuthLoginRequestDTO) {
      return {
        userId: dto.userId.trim(),
        password: dto.password.trim(),
      } as AccountDTO;
    } else {
      throw new Error('Unknown DTO type');
    }
  }

  static fromEntity(account: Account): AccountDTO {
    return {
      id: account.id,
      userId: account.userId,
      password: account.password,
      name: account.name,
      regNo: account.regNo,
      regNoIv: account.regNoIv,
      isActivated: account.isActivated,
      createDate: account.createDate?.toISOString(),
      updateDate: account.updateDate?.toISOString(),
    } as AccountDTO;
  }
}