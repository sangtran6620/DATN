import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ItemController } from "./item.controller";
import { ItemEntity } from "./item.entity";
import { ItemService } from "./item.service";
import { CategoryEntity } from "../category/category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ItemEntity, CategoryEntity])],
  controllers: [ItemController],
  exports: [ItemService],
  providers: [ItemService],
})
export class ItemModule {}
