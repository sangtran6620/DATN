import { ApiProperty } from "@nestjs/swagger";

import { PageMetaDto } from "./page-meta.dto";

export class PageDto<T> {
  @ApiProperty({ isArray: true })
  readonly data: T[];

  readonly message: string;

  @ApiProperty()
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto, message?: string) {
    this.data = data;
    this.meta = meta;
    this.message = message ? message : "Success";
  }
}

export class SimpleResponse<T> {
  @ApiProperty()
  readonly data: T;

  readonly message: string;

  constructor(data: T, message?: string) {
    this.data = data;
    this.message = message ? message : "Success";
  }
}

export class BaseResponse {
  readonly message: string;
}
