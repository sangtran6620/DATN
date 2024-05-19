export class AddToCartDto {
  items: ItemAddToCartDto[];
}

export class ItemAddToCartDto {
  itemId: string;
  quantity: number;
}

export class DeleteCartItemRequestDto {
  itemsId: string[];
}
