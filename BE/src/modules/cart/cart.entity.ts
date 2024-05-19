import { Column, Entity, OneToOne, BeforeInsert, OneToMany } from "typeorm";
import { BaseEntity } from "../../common/abstract.entity";
import { CartItemEntity } from "./cart-item.entity";

@Entity({ name: "carts" })
export class CartEntity extends BaseEntity {
  @OneToMany(() => CartItemEntity, cartItem => cartItem.cart)
  cart_items: CartItemEntity[];
}
