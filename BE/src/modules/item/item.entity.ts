import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { BaseEntity } from "../../common/abstract.entity";
import { CategoryEntity } from "../category/category.entity";
import { CartItemEntity } from "../cart/cart-item.entity";
import { ReviewEntity } from "../review/review.entity";

@Entity({ name: "items" })
export class ItemEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: 1 })
  quantity: number;

  @Column()
  price: number;

  @Column()
  cost: number;

  @Column({ nullable: true, array: true, type: "varchar" })
  images: string[];

  @OneToMany(() => ReviewEntity, reviews => reviews.item)
  reviews: ReviewEntity[];

  @ManyToMany(() => CategoryEntity, category => category.items)
  @JoinTable({
    name: "items_categories",
    inverseJoinColumn: {
      name: "category_id",
      referencedColumnName: "id",
    },
    joinColumn: {
      name: "item_id",
      referencedColumnName: "id",
    },
  })
  categories: CategoryEntity[];

  @OneToMany(() => CartItemEntity, cartItem => cartItem.item)
  cartItem: CartItemEntity[];

  @Column({ default: 0 })
  stock: number;

  @Column()
  details: string;

  @Column()
  sku: string;
}
