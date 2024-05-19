import {
  Column,
  Entity,
  OneToOne,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { BaseEntity } from "../../common/abstract.entity";
import { ItemEntity } from "../item/item.entity";
import { CartEntity } from "./cart.entity";

@Entity({ name: "cart_item" })
export class CartItemEntity extends BaseEntity {
  @ManyToOne(() => ItemEntity, item => item.cartItem)
  @JoinColumn()
  item: ItemEntity;

  @Column({ default: 1 })
  quantity: number;

  @ManyToOne(() => CartEntity, cart => cart.cart_items)
  cart: CartEntity;

  @Column({ name: "cart_id" })
  cartId: string;
}
