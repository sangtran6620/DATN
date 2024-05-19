import { BaseRequestDto } from "../../../common/abstract.dto";
import { CategoryStatus } from "../../../common/enum/category-status";

export class CategoryDto {
  id: string;
  image?: string;
  name: string;
  description?: string;
  parentId?: string;
  children?: CategoryDto[];
  slug: string;
  status?: CategoryStatus;
}

export class CreateParentCategoryDto {
  image?: string;
  name: string;
  description?: string;
  slug: string;
  status?: CategoryStatus;
}
export class CreateChildCategoryDto extends BaseRequestDto {
  image?: string;
  name: string;
  description?: string;
  parentId: string;
  slug: string;
  status?: CategoryStatus;
}

export class UpdateCategoryDto {
  id: string;
  image?: string;
  name: string;
  description?: string;
  parentId?: string;
  slug: string;
  status?: CategoryStatus;
}

export class DeleteCategoryDto extends BaseRequestDto {}
