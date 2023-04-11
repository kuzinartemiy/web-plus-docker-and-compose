import { IsNumber, IsString, IsDate, IsEmail } from 'class-validator';
import { UserEntity } from '../entities/user.entity';

export class SignupUserResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  username: string;

  @IsString()
  about: string;

  @IsString()
  avatar: string;

  @IsEmail()
  email: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  static getSignupUserResponse(user: UserEntity): SignupUserResponseDto {
    const { id, username, about, avatar, email, createdAt, updatedAt } = user;
    return {
      id,
      username,
      about,
      avatar,
      email,
      createdAt,
      updatedAt,
    };
  }
}
