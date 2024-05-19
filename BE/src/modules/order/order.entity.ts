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
import { OrderItemEntity } from "./orderItem.entity";

@Entity({ name: "orders" })
export class OrderEntity extends BaseEntity {
  @Column({ nullable: false })
  user_id: string;

  @Column({ nullable: false })
  total_quantity: number;

  @Column({ nullable: false })
  status: string;

  @Column({ nullable: false })
  total_price: number;

  @OneToMany(() => OrderItemEntity, orderItem => orderItem.order)
  orderItems: OrderItemEntity[];
}
