import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { WishEntity } from 'src/wishes/entities/wish.entity';
import { WishlistEntity } from 'src/wishlists/entities/wishlist.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileResponseDto } from './dto/user-profile.dto';
import { UserPublicProfileResponseDto } from './dto/user-public-profile.dto';
import { UserEntity } from './entities/user.entity';
import { USER_NOT_FOUND_ERROR } from './users.constants';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<UserEntity[]> {
    const foundedUsers = (await this.usersService.findAll()).map((user) => {
      delete user.password;
      return user;
    });

    return foundedUsers;
  }

  @Get('me')
  async getLoggedInUser(
    @Req() { user }: { user: UserEntity },
  ): Promise<UserProfileResponseDto> {
    const foundedUser = await this.usersService.findUserById(user.id);
    if (!foundedUser) throw new NotFoundException(USER_NOT_FOUND_ERROR);

    return UserProfileResponseDto.getProfile(foundedUser);
  }

  @Patch('me')
  async updateLoggedInUser(
    @Req() { user }: { user: UserEntity },
    @Body() dto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    const updatedUser = await this.usersService.updateById(user.id, dto);

    return UserProfileResponseDto.getProfile(updatedUser);
  }

  @Get('me/wishes')
  async getLoggedInUserWishes(@Req() { user }: { user: UserEntity }) {
    return await this.usersService.getUserWishes(user.id);
  }

  @Get('me/wishlists')
  async getLoggedInUserWishlists(
    @Req() { user }: { user: UserEntity },
  ): Promise<WishlistEntity[]> {
    return await this.usersService.getUserWishlists(user.id);
  }

  @Get(':username')
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<UserPublicProfileResponseDto> {
    const user = await this.usersService.findUserByUsername(username);
    if (!user) throw new NotFoundException(USER_NOT_FOUND_ERROR);

    return UserPublicProfileResponseDto.getPublicProfile(user);
  }

  @Post('find')
  async findUser(
    @Body('query') query: string,
  ): Promise<UserProfileResponseDto> {
    const user = await this.usersService.findUser(query);
    if (!user) throw new NotFoundException(USER_NOT_FOUND_ERROR);

    return UserProfileResponseDto.getProfile(user);
  }

  @Get(':username/wishes')
  async GetUserWishes(
    @Param('username') username: string,
  ): Promise<WishEntity[]> {
    const user = await this.usersService.findUserByUsername(username);
    if (!user) throw new NotFoundException(USER_NOT_FOUND_ERROR);

    return await this.usersService.getUserWishes(user.id);
  }
}
