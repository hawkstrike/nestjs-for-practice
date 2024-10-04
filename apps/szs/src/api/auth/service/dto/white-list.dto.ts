import { WhiteList } from '@prisma/client';

export class WhiteListDTO {
  id: number;
  name: string;
  regNo: string;
  regNoIv: string;

  constructor (id: number, name: string, regNo: string, regNoIv: string) {
    this.id = id;
    this.name = name;
    this.regNo = regNo;
    this.regNoIv = regNoIv;
  }

  static fromEntity(whiteList: WhiteList): WhiteListDTO {
    return {
      id: whiteList.id,
      name: whiteList.name,
      regNo: whiteList.regNo,
      regNoIv: whiteList.regNoIv,
    } as WhiteListDTO;
  }
}