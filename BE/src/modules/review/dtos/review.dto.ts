import { BaseRequestDto } from "src/common/abstract.dto";

export class CreateReviewRequestBaseDto extends BaseRequestDto {
  content: string;
  rating: number;

  item_id: string;
}
