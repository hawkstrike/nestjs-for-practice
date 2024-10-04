
export class AuthSignUpRequestDTO {
  userId: string;
  password: string;
  name: string;
  regNo: string;

  constructor (userId: string, password: string, name: string, regNo: string) {
    this.userId = userId;
    this.password = password;
    this.name = name;
    this.regNo = regNo;
  }
}