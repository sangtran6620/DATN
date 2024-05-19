import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { OrderEntity } from "./order.entity";
import { OrderController } from "./order.controller";
import { ItemEntity } from "../item/item.entity";
import { OrderItemEntity } from "./orderItem.entity";
import { OrderService } from "./order.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemEntity, OrderEntity, OrderItemEntity]),
  ],
  controllers: [OrderController],
  exports: [OrderService],
  providers: [OrderService],
})
export class OrderModule {}
