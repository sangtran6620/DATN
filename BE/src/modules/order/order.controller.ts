import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { SimpleResponse } from "../../common/dto/page.dto";

import { CreateOrderRequestBaseDto } from "./dtos/order.dto";
import { Auth } from "src/decorators";
import { OrderService } from "./order.service";

@Controller("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Auth()
  @Post("/create")
  async create(
    @Body()
    body: CreateOrderRequestBaseDto,
    @Req() req,
  ): Promise<SimpleResponse<any>> {
    await this.orderService.create(body, req.user.id);
    return new SimpleResponse(null, "Created successfully");
  }

  @Auth()
  @Get("/list")
  async list(@Req() req): Promise<SimpleResponse<any>> {
    const data = await this.orderService.list(req.user.id);
    return new SimpleResponse(data);
  }

  @Auth()
  @Post("/cancel")
  async cancel(
    @Body()
    body: { order_id: string },
    @Req() req,
  ): Promise<SimpleResponse<any>> {
    await this.orderService.cancel(body.order_id, req.user.id);
    return new SimpleResponse(null, "Canceled successfully");
  }
}
