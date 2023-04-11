import { IsBoolean, IsDate, IsNumber } from 'class-validator';
import { ColumnNumericTransformer } from 'src/helpers/column-numeric-transformer.helper';
import { UserEntity } from 'src/users/entities/user.entity';
import { WishEntity } from 'src/wishes/entities/wish.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('offers')
export class OfferEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.offers)
  user: UserEntity;

  @ManyToOne(() => WishEntity, (wish) => wish.offers)
  item: WishEntity;

  @Column({
    type: 'decimal',
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  @IsNumber()
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;
}
