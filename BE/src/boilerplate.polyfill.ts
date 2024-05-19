/* eslint-disable @typescript-eslint/naming-convention,sonarjs/cognitive-complexity */
import { map } from "lodash";
import { BaseEntity } from "./common/abstract.entity";
import { PageMetaDto } from "./common/dto/page-meta.dto";
import { PageDto } from "./common/dto/page.dto";

export type Constructor<T, Arguments> = new (arguments_: Arguments) => T;

declare global {
  interface Array<T> {
    toDtos<DTO>(this: T[]): DTO[];
    toPageDto(
      this: T[],
      pageMetaDto: PageMetaDto,
      // FIXME make option type visible from entity
      options?: unknown,
    ): PageDto<T>;
  }
}

Array.prototype.toDtos = function <Entity, DTO>(): DTO[] {
  let dto: Constructor<DTO, Entity>;
  return map(this, entity => new dto(entity));
};

Array.prototype.toPageDto = function (pageMetaDto: PageMetaDto) {
  return new PageDto(this.toDtos(), pageMetaDto);
};
