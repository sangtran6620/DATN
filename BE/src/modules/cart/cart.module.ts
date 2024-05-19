import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CartItemEntity } from "./cart-item.entity";

import { CartController } from "./cart.controller";
import { CartEntity } from "./cart.entity";
import { CartService } from "./cart.service";
import { ItemEntity } from "../item/item.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity, CartItemEntity, ItemEntity])],
  controllers: [CartController],
  exports: [CartService],
  providers: [CartService],
})
export class CartModule {}
