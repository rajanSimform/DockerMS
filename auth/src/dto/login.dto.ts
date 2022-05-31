import { IsEmail, IsNotEmpty } from 'class-validator';
export class LoginDto {
  @IsNotEmpty({ message: 'Email must be required' })
  @IsEmail({ message: 'Email must be an valid email' })
  public email: string;

  @IsNotEmpty({ message: 'Password must be required' })
  public password: string;
}
