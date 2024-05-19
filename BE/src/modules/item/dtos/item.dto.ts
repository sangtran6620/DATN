import { Transform } from "class-transformer";
import { BaseRequestDto, BaseResponseDto } from "../../../common/abstract.dto";
import { PageOptionsDto } from "../../../common/dto/page-options.dto";
import { BaseResponse } from "../../../common/dto/page.dto";
import { CategoryDto } from "../../category/dtos/category.dto";
import { ArrayMinSize, IsArray, IsString } from "class-validator";

export class ItemResponseBaseDto extends BaseResponseDto {
  name: string;
  description: string;
  price: number;
  cost: number;
  images: string[];
}

export class WriteItemRequestBaseDto extends BaseRequestDto {
  name: string;
  description: string;
  price: number;
  cost: number;
  images: string[];
  details: string;
  categoriesId: string[];
}

export class ItemDetailResponseDto extends ItemResponseBaseDto {
  details: string;
  categories: CategoryDto[];
  available: boolean;
  stock: number;
  quantity: number;
}

export class ListItemResponseDto extends ItemResponseBaseDto {}

export class UpdateItemDto extends WriteItemRequestBaseDto {
  id: string;
}

export class UpdateItemResponseDto extends BaseResponse {}

export class CreateItemDto extends WriteItemRequestBaseDto {}

export class SearchItemRequestDto extends PageOptionsDto {
  @Transform(({ value }) => (typeof value === "string" ? [value] : value))
  cates_slug?: string[];
  search: string;
  start_price: number;
  end_price: number;
}
