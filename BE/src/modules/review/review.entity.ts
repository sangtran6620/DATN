import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { BaseEntity } from "../../common/abstract.entity";
import { ItemEntity } from "../item/item.entity";
import { UserEntity } from "../user/user.entity";

@Entity({ name: "reviews" })
export class ReviewEntity extends BaseEntity {
  @Column()
  content: string;

  @Column()
  rating: number;

  @Column({ name: "item_id" })
  item_id: string;

  @ManyToOne(() => ItemEntity, item => item.reviews)
  @JoinColumn({ name: "item_id" })
  item: ItemEntity;

  @Column({ name: "user_id" })
  user_id: string;

  @ManyToOne(() => UserEntity, user => user.reviews)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;
}
