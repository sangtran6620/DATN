import { ApiProperty } from "@nestjs/swagger";

import { UserDto } from "../../user/dtos/user.dto";
import { AuthTokenPayloadDto } from "./TokenPayloadDto";

export class LoginPayloadDto {
  user: UserDto;

  token: AuthTokenPayloadDto;

  constructor(user: UserDto, token: AuthTokenPayloadDto) {
    this.user = user;
    this.token = token;
  }
}
