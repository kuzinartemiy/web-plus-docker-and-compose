import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/hash/hash.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import {
  USER_NOT_FOUND_ERROR,
  WRONG_USERNAME_OR_PASSWORD_ERROR,
} from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async validateUser(username: string, password: string): Promise<UserEntity> {
    const user = await this.usersService.findUserByUsername(username);
    if (!user) throw new UnauthorizedException(USER_NOT_FOUND_ERROR);

    const isCorrectPassword: boolean = await this.hashService.compare(
      password,
      user.password,
    );

    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_USERNAME_OR_PASSWORD_ERROR);
    }

    delete user.password;
    return user;
  }

  async login(email: string): Promise<{ access_token: string }> {
    const payload = { email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
