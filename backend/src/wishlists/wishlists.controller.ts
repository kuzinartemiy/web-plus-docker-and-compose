import {
  Controller,
  Post,
  Get,
  UseGuards,
  Body,
  Req,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistEntity } from './entities/wishlist.entity';
import { WishlistsService } from './wishlists.service';

@UseGuards(JwtAuthGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  async createWishlist(@Req() { user }, @Body() dto: CreateWishlistDto) {
    return await this.wishlistsService.create(dto, user.id);
  }

  @Get()
  async getWishlists(): Promise<WishlistEntity[]> {
    return await this.wishlistsService.findAllWishlists();
  }

  @Get(':id')
  async getWishlistById(@Param('id') id: number): Promise<WishlistEntity> {
    return await this.wishlistsService.findWishlistById(id);
  }

  @Patch(':id')
  async updateWishlist(
    @Req() { user },
    @Param('id') id: number,
    @Body() dto: UpdateWishlistDto,
  ): Promise<WishlistEntity> {
    return await this.wishlistsService.updateWishlist(id, dto, user.id);
  }

  @Delete(':id')
  async deleteWishlist(@Req() { user }, @Param('id') id: number) {
    return await this.wishlistsService.deleteWishlist(id, user.id);
  }
}
