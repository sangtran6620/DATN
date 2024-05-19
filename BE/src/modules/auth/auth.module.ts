import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { ApiConfigService } from "../../shared/services/api-config.service";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { PublicStrategy } from "./public.strategy";
import { UserSettingsEntity } from "../user/user-settings.entity";
import { UserEntity } from "../user/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule.register({ defaultStrategy: "jwt" }),
    TypeOrmModule.forFeature([UserEntity, UserSettingsEntity]),
    JwtModule.registerAsync({
      useFactory: (configService: ApiConfigService) => ({
        // privateKey: configService.authConfig.privateKey,
        // publicKey: configService.authConfig.publicKey,
        secret: configService.authConfig.jwtSecret,
        signOptions: {
          // algorithm: 'RS256',
          expiresIn: configService.authConfig.jwtAccessExpirationTime,
        },
        // verifyOptions: {
        //   algorithms: ['RS256'],
        // },
        // if you want to use token with expiration date
        // signOptions: {
        //     expiresIn: configService.getNumber('JWT_EXPIRATION_TIME'),
        // },
      }),
      inject: [ApiConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PublicStrategy],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
