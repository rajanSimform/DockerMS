import { IsEmail, IsNotEmpty } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty({ message: 'Name must be required' })
  name: string;

  @IsNotEmpty({ message: 'Email must be required' })
  @IsEmail({ message: 'Email must be an valid email' })
  email: string;

  @IsNotEmpty({ message: 'Password must be required' })
  password: string;
}
