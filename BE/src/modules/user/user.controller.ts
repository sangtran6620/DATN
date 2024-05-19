import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  ValidationPipe,
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

import { PageDto } from "../../common/dto/page.dto";
import { ApiPageOkResponse, UUIDParam } from "../../decorators";
import { UserDto } from "./dtos/user.dto";
import { UsersPageOptionsDto } from "./dtos/users-page-options.dto";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  // @Get('admin')
  // // @Auth([RoleType.USER])
  // @HttpCode(HttpStatus.OK)
  // async admin(@AuthUser() user: UserEntity) {

  //   return {
  //     text: `${translation} ${user.firstName}`,
  //   };
  // }

  @Get("/all")
  getUsers(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    return this.userService.getUsers(pageOptionsDto);
  }

  @Get(":id")
  getUser(@UUIDParam("id") userId: string): Promise<UserDto> {
    return this.userService.getUser(userId);
  }
}
