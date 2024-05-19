import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { StatusCodesList } from "../../common/constants/status-codes-list.constants";
import { TokenType } from "../../common/constants/token-type";
import { Platform } from "../../common/enum/platform";
import { UserRole } from "../../common/enum/user-role";
import { CustomHttpException } from "../../common/exception/custom-http.exception";
import { validateHash } from "../../common/utils";
import { ApiConfigService } from "../../shared/services/api-config.service";

import type { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { AuthTokenPayloadDto, TokenPayloadDto } from "./dto/TokenPayloadDto";
import type { UserLoginDto } from "./dto/UserLoginDto";

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
    private userService: UserService,
  ) {}

  // async createAccessToken(data: { userId: string }): Promise<TokenPayloadDto> {
  //   return new TokenPayloadDto({
  //     expiresIn: this.configService.authConfig.jwtExpirationTime,
  //     accessToken: await this.jwtService.signAsync({
  //       userId: data.userId,
  //       type: TokenType.ACCESS_TOKEN,
  //     }),
  //   });
  // }

  async generateAuthToken(user_id: string): Promise<AuthTokenPayloadDto> {
    const access_token = this.generateToken(
      user_id,
      TokenType.ACCESS_TOKEN,
      this.configService.authConfig.jwtAccessExpirationTime,
    );

    const refresh_token = this.generateToken(
      user_id,
      TokenType.REFRESH_TOKEN,
      this.configService.authConfig.jwtRefreshExpirationTime,
    );
    // await this.saveToken(refresh_token, user, TokenType.RefreshToken);
    return {
      access_token,
      refresh_token,
      expiresIn: this.configService.authConfig.jwtAccessExpirationTime,
    };
  }

  // async saveToken(token: string, user: UserEntity, tokenType: TokenType) {
  //   let tokenDoc = await this.tokenRepo.findOne({
  //     where: { user, type: tokenType },
  //   });
  //   if (tokenDoc) {
  //     tokenDoc.token = token;
  //     tokenDoc.active = true;
  //   } else {
  //     tokenDoc = this.tokenRepo.create({
  //       token,
  //       user,
  //       type: tokenType,
  //     });
  //   }
  //   return this.tokenRepo.save(tokenDoc);
  // }

  generateToken(userId: string, type: string, expiresIn: number | string) {
    const payload = { sub: userId, type };
    return this.jwtService.sign(payload, {
      expiresIn: expiresIn,
      secret: this.configService.authConfig.jwtSecret,
    });
  }

  async login(userLoginDto: UserLoginDto): Promise<UserEntity> {
    const role =
      userLoginDto.requestFrom === Platform.CMS
        ? UserRole.ADMINSTRATOR
        : UserRole.USER;
    try {
      const user = await this.userService.findOne({
        email: userLoginDto.email,
        role,
      });

      if (!user) {
        throw new Error("User not found");
      }
      const isPasswordValid = await validateHash(
        userLoginDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new Error("Password doesn't match");
      }
      return user;
    } catch (error) {
      this.logger.error(error);
      throw new CustomHttpException({
        statusCode: HttpStatus.UNAUTHORIZED,
        code: StatusCodesList.EmailOrPasswordIncorrect,
        message: error.message,
      });
    }
  }

  async verifyToken(token: string): Promise<TokenPayloadDto> {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayloadDto>(
        token,
        {
          secret: this.configService.authConfig.jwtSecret,
        },
      );
      return payload;
    } catch (error) {
      throw new CustomHttpException({
        statusCode: HttpStatus.UNAUTHORIZED,
        code: StatusCodesList.InvalidToken,
        message: error.message,
      });
    }
  }

  async verifyRefreshToken(token: string): Promise<TokenPayloadDto> {
    const payload = await this.verifyToken(token);
    if (payload.type !== TokenType.REFRESH_TOKEN) {
      throw new CustomHttpException({
        statusCode: HttpStatus.UNAUTHORIZED,
        code: StatusCodesList.InvalidRefreshToken,
        message: "Invalid refresh token",
      });
    }
    return payload;
  }
}
