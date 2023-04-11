import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { In, Repository, UpdateResult } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishEntity } from './entities/wish.entity';
import {
  USER_NOT_FOUND_ERROR,
  USER_NOT_WISH_OWNER_ERROR,
  WISH_NOT_FOUND_ERROR,
  WISH_RAISED_NOT_NULL_ERROR,
} from './wishes.constants';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(WishEntity)
    private readonly wishesRepository: Repository<WishEntity>,
    private readonly usersService: UsersService,
  ) {}

  async createWish(dto: CreateWishDto, ownerId: number): Promise<WishEntity> {
    const user = await this.usersService.findUserById(ownerId);
    const newWish = this.wishesRepository.create({
      ...dto,
      owner: user,
    });
    const savedWish = await this.wishesRepository.save(newWish);

    delete savedWish.owner.password;
    delete savedWish.owner.email;

    return savedWish;
  }

  findAll(): Promise<WishEntity[]> {
    return this.wishesRepository.find();
  }

  async findLastWishes(): Promise<WishEntity[]> {
    const lastWishes = await this.wishesRepository.find({
      take: 40,
      order: { createdAt: 'desc' },
      relations: ['owner'],
    });

    for (const wish of lastWishes) {
      delete wish.owner.password;
      delete wish.owner.email;
    }

    return lastWishes;
  }

  async findTopWishes(): Promise<WishEntity[]> {
    const topWishes = await this.wishesRepository.find({
      take: 10,
      order: { copied: 'desc' },
      relations: ['owner'],
    });

    for (const wish of topWishes) {
      delete wish.owner.password;
      delete wish.owner.email;
    }

    return topWishes;
  }

  async findWishById(id: number): Promise<WishEntity> {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });

    if (!wish) throw new NotFoundException(WISH_NOT_FOUND_ERROR);

    delete wish.owner.password;
    delete wish.owner.email;

    return wish;
  }

  async updateWish(
    wishId: number,
    dto: UpdateWishDto,
    userId: number,
  ): Promise<UpdateResult> {
    const wish = await this.findWishById(wishId);
    if (!wish) throw new BadRequestException(WISH_NOT_FOUND_ERROR);
    if (wish.raised) throw new BadRequestException(WISH_RAISED_NOT_NULL_ERROR);

    if (wish.owner.id !== userId) {
      throw new BadRequestException(USER_NOT_WISH_OWNER_ERROR);
    }

    return this.wishesRepository.update(wishId, dto);
  }

  async deleteWishById(wishId: number, userId: number): Promise<WishEntity> {
    const wish = await this.findWishById(wishId);
    if (!wish) throw new BadRequestException(WISH_NOT_FOUND_ERROR);
    if (wish.raised) throw new BadRequestException(WISH_RAISED_NOT_NULL_ERROR);

    if (wish.owner.id !== userId) {
      throw new BadRequestException(USER_NOT_WISH_OWNER_ERROR);
    }

    await this.wishesRepository.delete(wishId);

    delete wish.owner.password;
    delete wish.owner.email;

    return wish;
  }

  async copyWish(wishId: number, userId: number): Promise<WishEntity> {
    const wish = await this.wishesRepository.findOneBy({ id: wishId });
    if (!wish) throw new NotFoundException(WISH_NOT_FOUND_ERROR);
    delete wish.id;
    delete wish.createdAt;
    delete wish.updatedAt;

    const user = await this.usersService.findUserById(userId);
    if (!user) throw new NotFoundException(USER_NOT_FOUND_ERROR);

    await this.wishesRepository.update(wishId, {
      copied: (wish.copied += 1),
    });

    const wishCopy = {
      ...wish,
      owner: user,
      copied: 0,
      raised: 0,
      offers: [],
    };

    return await this.createWish(wishCopy, user.id);
  }

  updateWishRaised(id: number, raised: number): Promise<UpdateResult> {
    return this.wishesRepository.update(id, { raised });
  }

  findWishesByIds(ids: number[]): Promise<WishEntity[]> {
    return this.wishesRepository.find({
      where: { id: In(ids) },
    });
  }
}
