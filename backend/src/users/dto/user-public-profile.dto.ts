import { IsDate, IsNumber, IsString } from 'class-validator';
import { UserEntity } from '../entities/user.entity';

export class UserPublicProfileResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  username: string;

  @IsString()
  about: string;

  @IsString()
  avatar: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  static getPublicProfile(user: UserEntity): UserPublicProfileResponseDto {
    const { id, username, about, avatar, createdAt, updatedAt } = user;
    return {
      id,
      username,
      about,
      avatar,
      createdAt,
      updatedAt,
    };
  }
}
