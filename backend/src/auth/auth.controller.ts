import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SignupUserResponseDto } from 'src/users/dto/signup-user.dto';
import { UsersService } from 'src/users/users.service';
import { USER_EXIST_ERROR } from './auth.constants';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  async signup(@Body() dto: CreateUserDto): Promise<SignupUserResponseDto> {
    const foundedUserByEmail = await this.usersService.findUserByEmail(
      dto.email,
    );
    const foundedUserByUsername = await this.usersService.findUserByUsername(
      dto.username,
    );
    if (foundedUserByEmail || foundedUserByUsername) {
      throw new BadRequestException(USER_EXIST_ERROR);
    }

    return await this.usersService.create(dto);
  }

  @UseGuards(LocalGuard)
  @HttpCode(200)
  @Post('signin')
  async signin(@Req() { user }): Promise<{
    access_token: string;
  }> {
    return await this.authService.login(user.email);
  }
}
