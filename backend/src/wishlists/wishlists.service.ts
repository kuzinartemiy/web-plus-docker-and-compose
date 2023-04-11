import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPublicProfileResponseDto } from 'src/users/dto/user-public-profile.dto';
import { USER_NOT_FOUND_ERROR } from 'src/users/users.constants';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistEntity } from './entities/wishlist.entity';
import {
  WISHLIST_NOT_FOUND_ERROR,
  WRONG_OWNER_ERROR,
} from './wishlists.constants';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(WishlistEntity)
    private readonly wishlistsRepository: Repository<WishlistEntity>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async create(dto: CreateWishlistDto, userId: number) {
    const user = await this.usersService.findUserById(userId);
    if (!user) throw new NotFoundException(USER_NOT_FOUND_ERROR);

    const wishes = await this.wishesService.findWishesByIds(dto.itemsId);

    const newWishlist = this.wishlistsRepository.create({
      ...dto,
      owner: user,
      items: wishes,
    });
    const savedWishlist = await this.wishlistsRepository.save(newWishlist);

    return {
      ...savedWishlist,
      owner: UserPublicProfileResponseDto.getPublicProfile(user),
      items: wishes,
    };
  }

  async findAllWishlists(): Promise<WishlistEntity[]> {
    const wishlists = await this.wishlistsRepository.find({
      relations: ['owner', 'items'],
    });

    for (const wishlist of wishlists) {
      delete wishlist.owner.password;
      delete wishlist.owner.email;
    }

    return wishlists;
  }

  async findWishlistById(id: number): Promise<WishlistEntity> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
    if (!wishlist) throw new NotFoundException(WISHLIST_NOT_FOUND_ERROR);

    delete wishlist.owner.password;
    delete wishlist.owner.email;

    return wishlist;
  }

  async updateWishlist(
    id: number,
    dto: UpdateWishlistDto,
    userId: number,
  ): Promise<WishlistEntity> {
    const wishlist = await this.findWishlistById(id);
    if (!wishlist) throw new NotFoundException(WISHLIST_NOT_FOUND_ERROR);

    const user = await this.usersService.findUserById(userId);
    if (!user) throw new NotFoundException(USER_NOT_FOUND_ERROR);

    if (wishlist.owner.id !== userId) {
      throw new BadRequestException(WRONG_OWNER_ERROR);
    }

    const wishes = await this.wishesService.findWishesByIds(dto.itemsId || []);

    const updatingWishlist: WishlistEntity = {
      ...wishlist,
      name: dto.name,
      image: dto.image,
      description: dto.description,
      items: wishes,
      updatedAt: new Date(),
    };

    return this.wishlistsRepository.save(updatingWishlist);
  }

  async deleteWishlist(id: number, userId: number) {
    const wishlist = await this.findWishlistById(id);
    if (!wishlist) throw new NotFoundException(WISHLIST_NOT_FOUND_ERROR);

    if (wishlist.owner.id !== userId) {
      throw new BadRequestException(WRONG_OWNER_ERROR);
    }

    await this.wishlistsRepository.delete(id);

    const deletedWishlist = {
      ...wishlist,
      owner: UserPublicProfileResponseDto.getPublicProfile(wishlist.owner),
    };

    return deletedWishlist;
  }
}
