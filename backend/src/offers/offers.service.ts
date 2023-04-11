import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferEntity } from './entities/offer.entity';
import {
  FINAL_AMOUNT_EXCEED_PRICE_ERROR,
  OFFER_NOT_FOUND_ERROR,
  USER_NOT_FOUND_ERROR,
  WISH_ITEM_NOT_FOUND_ERROR,
  WISH_OWNER_CANNOT_PAY_ERROR,
} from './offers.constants';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(OfferEntity)
    private readonly offersRepository: Repository<OfferEntity>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async create(dto: CreateOfferDto, userId: number): Promise<OfferEntity> {
    const user = await this.usersService.findUserById(userId);
    if (!user) throw new NotFoundException(USER_NOT_FOUND_ERROR);
    delete user.password;

    const wish = await this.wishesService.findWishById(dto.itemId);
    if (!wish) throw new NotFoundException(WISH_ITEM_NOT_FOUND_ERROR);

    if (wish.owner.id === user.id) {
      throw new BadRequestException(WISH_OWNER_CANNOT_PAY_ERROR);
    }

    const calculatedRaised: number = +(wish.raised + dto.amount).toFixed(2);

    if (calculatedRaised > wish.price) {
      throw new BadRequestException(FINAL_AMOUNT_EXCEED_PRICE_ERROR);
    }

    await this.wishesService.updateWishRaised(wish.id, calculatedRaised);

    const createdOffer = this.offersRepository.create({
      ...dto,
      user,
      item: wish,
    });
    return this.offersRepository.save(createdOffer);
  }

  findAll(): Promise<OfferEntity[]> {
    return this.offersRepository.find({ relations: ['item', 'user'] });
  }

  async findOfferById(id: number): Promise<OfferEntity> {
    const offer = await this.offersRepository.findOne({
      where: { id },
      relations: ['item', 'user'],
    });

    if (!offer) throw new NotFoundException(OFFER_NOT_FOUND_ERROR);

    delete offer.user.password;

    return offer;
  }
}
