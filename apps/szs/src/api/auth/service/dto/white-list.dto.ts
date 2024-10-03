import { WhiteList } from '@prisma/client';

export class WhiteListDTO {
  id: number;
  name: string;
  regNo: string;
  regNoIv: string;

  static fromEntity(whiteList: WhiteList): WhiteListDTO {
    return {
      id: whiteList.id,
      name: whiteList.name,
      regNo: whiteList.regNo,
      regNoIv: whiteList.regNoIv,
    } as WhiteListDTO;
  }
}