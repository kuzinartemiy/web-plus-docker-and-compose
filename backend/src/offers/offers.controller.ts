import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferEntity } from './entities/offer.entity';
import { OffersService } from './offers.service';

@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async createOffer(
    @Body() dto: CreateOfferDto,
    @Req() { user }: { user: UserEntity },
  ): Promise<OfferEntity> {
    return await this.offersService.create(dto, user.id);
  }

  @Get()
  async findOffers(): Promise<OfferEntity[]> {
    return await this.offersService.findAll();
  }

  @Get(':id')
  async findOffersById(@Param('id') id: number): Promise<OfferEntity> {
    return await this.offersService.findOfferById(id);
  }
}
