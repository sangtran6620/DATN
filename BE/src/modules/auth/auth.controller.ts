import { Body, Controller, Get, Post } from "@nestjs/common";
import { BaseResponse, SimpleResponse } from "../../common/dto/page.dto";

import { AuthUser } from "../../decorators";
import { UserDto } from "../user/dtos/user.dto";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import { LoginPayloadDto } from "./dto/LoginPayloadDto";
import { UserLoginDto } from "./dto/UserLoginDto";
import { UserRegisterDto } from "./dto/UserRegisterDto";

@Controller("/auth")
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post("/login")
  async login(
    @Body() userLoginDto: UserLoginDto,
  ): Promise<SimpleResponse<LoginPayloadDto>> {
    const userEntity = await this.authService.login(userLoginDto);

    const token = await this.authService.generateAuthToken(userEntity.id);
    return new SimpleResponse(
      new LoginPayloadDto(userEntity.toDto(), token),
      "User logged in successfully",
    );
  }

  @Post("/register")
  async register(
    @Body() userRegisterDto: UserRegisterDto,
  ): Promise<SimpleResponse<void>> {
    await this.userService.createUser(userRegisterDto);

    return new SimpleResponse(null, "User created successfully");
  }

  @Get("/me")
  // @Auth([RoleType.USER, RoleType.ADMIN])
  async getCurrentUser(
    @AuthUser() user: UserEntity,
  ): Promise<SimpleResponse<UserDto>> {
    return new SimpleResponse(user.toDto(), "User info");
  }

  @Post("/refresh-token")
  async refreshToken(@Body("refresh_token") refresh_token: string) {
    const payload = await this.authService.verifyRefreshToken(refresh_token);
    const token = await this.authService.generateAuthToken(payload.sub);
    return new SimpleResponse(token, "Refresh token successfully");
  }
}
