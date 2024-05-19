import { BaseRequestDto } from "src/common/abstract.dto";

export class CreateOrderRequestBaseDto extends BaseRequestDto {
  data: {
    item_id: string;
    quantity: number;
  }[];
}
