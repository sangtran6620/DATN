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
import { OrderEntity } from "./order.entity";

@Entity({ name: "orders_item" })
export class OrderItemEntity extends BaseEntity {
  @Column({ nullable: false })
  item_id: string;

  @Column({ nullable: false })
  quantity: number;

  @OneToOne(() => ItemEntity)
  @JoinColumn({ name: "item_id" })
  item: ItemEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @Column({ nullable: false })
  user_id: string;

  @ManyToOne(() => OrderEntity, order => order.orderItems)
  @JoinColumn({ name: "order_id" })
  order: OrderEntity;

  @Column({ nullable: false })
  price: number;
}
