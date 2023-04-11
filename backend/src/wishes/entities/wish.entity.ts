import { Length, IsString, IsUrl } from 'class-validator';
import { ColumnNumericTransformer } from 'src/helpers/column-numeric-transformer.helper';
import { OfferEntity } from 'src/offers/entities/offer.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('wishes')
export class WishEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 250 })
  @IsString()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({
    type: 'numeric',
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  price: number;

  @Column({
    type: 'numeric',
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  raised: number;

  @ManyToOne(() => UserEntity, (user) => user.wishes)
  owner: UserEntity;

  @Column({ length: 1024 })
  @IsString()
  @Length(1, 1024)
  description: string;

  @OneToMany(() => OfferEntity, (offer) => offer.item)
  offers: OfferEntity[];

  @Column('int', { default: 0 })
  copied: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
