import { Length, IsEmail, IsString, IsDate, IsNotEmpty } from 'class-validator';
import { OfferEntity } from 'src/offers/entities/offer.entity';
import { WishEntity } from 'src/wishes/entities/wish.entity';
import { WishlistEntity } from 'src/wishlists/entities/wishlist.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  USER_ABOUT_DEFAULT_TEXT,
  USER_AVATAR_DEFAULT_LINK,
} from '../users.constants';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30, unique: true })
  @IsString()
  @Length(2, 30)
  @IsNotEmpty()
  username: string;

  @Column({
    length: 200,
    default: USER_ABOUT_DEFAULT_TEXT,
  })
  @IsString()
  @Length(2, 200)
  about: string;

  @Column({ default: USER_AVATAR_DEFAULT_LINK })
  @IsString()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  password: string;

  @OneToMany(() => WishEntity, (wish) => wish.owner)
  wishes: WishEntity[];

  @OneToMany(() => OfferEntity, (offer) => offer.user)
  offers: OfferEntity[];

  @OneToMany(() => WishlistEntity, (wishlist) => wishlist.owner)
  wishlists: WishlistEntity[];

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;
}
