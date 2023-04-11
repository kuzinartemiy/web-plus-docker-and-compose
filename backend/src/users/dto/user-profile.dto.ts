import { IsDate, IsEmail, IsNumber, IsString } from 'class-validator';
import { UserEntity } from '../entities/user.entity';

export class UserProfileResponseDto {
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

  static getProfile(user: UserEntity): UserProfileResponseDto {
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
