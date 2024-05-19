import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Request,
} from "@nestjs/common";
import { Auth } from "../../decorators";
import { CartService } from "./cart.service";
import { AddToCartDto, DeleteCartItemRequestDto } from "./dtos/cart.dto";
import { SimpleResponse } from "../../common/dto/page.dto";

@Controller("cart")
export class CartController {
  constructor(private cartService: CartService) {}

  @Get("/")
  @Auth()
  async findUserCart(@Req() req) {
    const data = await this.cartService.findCartById(req.user.cartId);
    return new SimpleResponse(data);
  }

  @Post("/add")
  @Auth()
  async addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
    await this.cartService.addToCart(req.user.cartId, addToCartDto);
    return new SimpleResponse(null);
  }

  @Delete("/delete-cart-item")
  @Auth()
  async deleteCartItem(@Request() req, @Body() body: DeleteCartItemRequestDto) {
    await this.cartService.deleteCartItem(req.user.cartId, body.itemsId);
    return new SimpleResponse(null);
  }
}
