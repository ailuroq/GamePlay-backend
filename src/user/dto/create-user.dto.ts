export class CreateUserDto {
  readonly id: number;
  readonly username: string;
  password: string;
  readonly email: string;
  avatarName: string;
}
