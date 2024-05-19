import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from "class-validator";
import { Column } from "typeorm";

import { Trim } from "../../../decorators/transform.decorators";

export class UserRegisterDto {
  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // @Trim()
  // readonly firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly username: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Trim()
  readonly email: string;

  @IsString()
  @MinLength(6)
  readonly password: string;

  // @ApiProperty()
  // @Column()
  // @IsPhoneNumber("VN")
  // @IsOptional()
  // phone: string;
}
