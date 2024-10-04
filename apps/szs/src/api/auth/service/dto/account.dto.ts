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

  constructor (
    id: number,
    userId: string,
    password: string,
    name: string,
    regNo: string,
    regNoIv: string,
    isActivated: boolean,
    createDate: string,
    updateDate: string
  ) {
    this.id = id;
    this.userId = userId;
    this.password = password;
    this.name = name;
    this.regNo = regNo;
    this.regNoIv = regNoIv;
    this.isActivated = isActivated;
    this.createDate = createDate;
    this.updateDate = updateDate;
  }

  static of(dto: AuthSignUpRequestDTO | AuthLoginRequestDTO): AccountDTO {
    if ('name' in dto && 'regNo' in dto) {
      return {
        userId: dto.userId.trim(),
        password: dto.password.trim(),
        name: dto.name.trim(),
        regNo: dto.regNo.trim(),
      } as AccountDTO;
    } else {
      return {
        userId: dto.userId.trim(),
        password: dto.password.trim(),
      } as AccountDTO;
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