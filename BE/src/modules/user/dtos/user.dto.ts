import { Exclude } from "class-transformer";
import { BaseResponseDto } from "../../../common/abstract.dto";

export class UserDto extends BaseResponseDto {
  firstName?: string;

  lastName?: string;

  // @ApiPropertyOptional({ enum: RoleType })
  // role: RoleType;

  email?: string;

  avatar?: string;

  phone?: string;

  isActive?: boolean;
}
