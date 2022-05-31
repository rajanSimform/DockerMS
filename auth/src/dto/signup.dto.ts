import { IsEmail, IsNotEmpty } from 'class-validator';
export class SignUpDto {
  @IsNotEmpty({ message: 'Name must be required' })
  public name: string;

  @IsNotEmpty({ message: 'Email must be required' })
  @IsEmail({ message: 'Email must be an valid email' })
  public email: string;

  @IsNotEmpty({ message: 'Password must be required' })
  public password: string;
}
