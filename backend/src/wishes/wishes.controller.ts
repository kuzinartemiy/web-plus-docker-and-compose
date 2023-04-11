import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  Get,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserEntity } from 'src/users/entities/user.entity';
import { UpdateResult } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishEntity } from './entities/wish.entity';
import { WishesService } from './wishes.service';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllWishes(): Promise<WishEntity[]> {
    return await this.wishesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createWish(
    @Req() req,
    @Body() dto: CreateWishDto,
  ): Promise<WishEntity> {
    return await this.wishesService.createWish(dto, req.user.id);
  }

  @Get('last')
  async getLastWishes(): Promise<WishEntity[]> {
    return await this.wishesService.findLastWishes();
  }

  @Get('top')
  async getTopWishes(): Promise<WishEntity[]> {
    return await this.wishesService.findTopWishes();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getWishById(@Param('id') id: number): Promise<WishEntity> {
    return await this.wishesService.findWishById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateWish(
    @Req() { user },
    @Param('id') id: number,
    @Body() dto: UpdateWishDto,
  ): Promise<UpdateResult> {
    return await this.wishesService.updateWish(id, dto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteWish(
    @Req() { user },
    @Param('id') id: number,
  ): Promise<WishEntity> {
    return await this.wishesService.deleteWishById(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  async copyWish(
    @Req() { user }: { user: UserEntity },
    @Param('id') id: string,
  ) {
    return await this.wishesService.copyWish(+id, user.id);
  }
}
