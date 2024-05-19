import { ApiProperty } from "@nestjs/swagger";
import { TokenType } from "../../../common/constants/token-type";

export class AuthTokenPayloadDto {
  @ApiProperty()
  expiresIn: number | string;

  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;

  constructor(data: {
    expiresIn: number;
    accessToken: string;
    refreshToken: string;
  }) {
    this.expiresIn = data.expiresIn;
    this.access_token = data.accessToken;
    this.refresh_token = data.refreshToken;
  }
}

export class TokenPayloadDto {
  sub: string;
  type: TokenType;
  iat: number;
  exp: number;
}
