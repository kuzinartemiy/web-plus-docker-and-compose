import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistEntity } from './entities/wishlist.entity';
import { UsersModule } from 'src/users/users.module';
import { WishesModule } from 'src/wishes/wishes.module';

@Module({
  providers: [WishlistsService],
  controllers: [WishlistsController],
  imports: [
    TypeOrmModule.forFeature([WishlistEntity]),
    UsersModule,
    WishesModule,
  ],
})
export class WishlistsModule {}
