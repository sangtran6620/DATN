import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { PageMetaDto } from "../../common/dto/page-meta.dto";
import { PageOptionsDto } from "../../common/dto/page-options.dto";
import { PageDto } from "../../common/dto/page.dto";
import { queryPagination } from "../../common/utils";
import {
  CreateItemDto,
  ItemDetailResponseDto,
  ListItemResponseDto,
  SearchItemRequestDto,
  UpdateItemDto,
  UpdateItemResponseDto,
} from "./dtos/item.dto";

import { ItemEntity } from "./item.entity";
import { CategoryEntity } from "../category/category.entity";
import { log } from "console";
import { CustomHttpException } from "../../common/exception/custom-http.exception";
import { StatusCodesList } from "../../common/constants/status-codes-list.constants";

interface ItemServiceInterface {
  search(request: SearchItemRequestDto): Promise<[ItemEntity[], number]>;
  create(itemDto: CreateItemDto): Promise<ItemDetailResponseDto>;
  update(updateItemDto: UpdateItemDto): Promise<UpdateItemResponseDto>;
  getOneItemById(id: string): Promise<ItemDetailResponseDto>;
  deleteOneItemById(id: string): Promise<void>;
  suggest(keyword: string): Promise<ListItemResponseDto[]>;
}

@Injectable()
export class ItemService implements ItemServiceInterface {
  private readonly logger: Logger = new Logger(ItemService.name);
  constructor(
    @InjectRepository(ItemEntity)
    private itemRepository: Repository<ItemEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async search(request: SearchItemRequestDto): Promise<[ItemEntity[], number]> {
    const qb = this.itemRepository.createQueryBuilder("item");

    if (request.search?.length > 0) {
      qb.andWhere("item.name ILIKE :search", {
        search: `%${request.search}%`,
      });
    }
    if (request.start_price && request.end_price) {
      qb.andWhere("item.price BETWEEN :start_price AND :end_price", {
        start_price: request.start_price,
        end_price: request.end_price,
      });
    }
    if (request.cates_slug?.length > 0) {
      qb.innerJoinAndSelect("item.categories", "category");
      qb.andWhere("category.slug IN (:...cates_slug)", {
        cates_slug: request.cates_slug,
      });
    }

    return await queryPagination<ItemEntity>({
      query: qb,
      o: request,
    });
  }

  async create(itemDto: CreateItemDto): Promise<ItemDetailResponseDto> {
    // create unique sku with prefix "SKU" like "SKU-1234567890"
    let unique = false;
    let sku = "";
    while (!unique) {
      sku = `SKU-${Math.floor(Math.random() * 10000000000)}`;
      const rs = await this.itemRepository.findOneBy({ sku: sku });
      if (!rs) {
        unique = true;
      }
    }

    const cats = await this.categoryRepository.find({
      where: { id: In(itemDto.categoriesId) },
    });

    if (cats.length !== itemDto.categoriesId.length) {
      throw new CustomHttpException({
        statusCode: HttpStatus.BAD_REQUEST,
        code: StatusCodesList.CategoryNotFound,
      });
    }

    const item = this.itemRepository.create({
      ...itemDto,
      categories: cats,
      sku: sku,
    });

    const rs = await this.itemRepository.save(item);
    return {
      ...rs,
      available: rs.stock > 0,
    };
  }

  async update(updateItemDto: UpdateItemDto): Promise<UpdateItemResponseDto> {
    const u = await this.itemRepository
      .createQueryBuilder()
      .update({
        cost: updateItemDto.cost,
        price: updateItemDto.price,
        name: updateItemDto.name,
        description: updateItemDto.description,
        images: updateItemDto.images,
      })
      .where("id = :id", { id: updateItemDto.id })
      .returning("*")
      .execute();

    return {
      message: "Item updated successfully",
    };
  }

  async getOneItemById(id: string): Promise<ItemDetailResponseDto> {
    const rs = await this.itemRepository.findOneBy({ id: id });
    return {
      ...rs,
      available: rs.stock > 0,
    };
  }

  async deleteOneItemById(id: string): Promise<void> {
    await this.itemRepository.softDelete({ id: id });
  }

  async suggest(keyword: string): Promise<ListItemResponseDto[]> {
    const rs = await this.itemRepository
      .createQueryBuilder("item")
      .where("item.name ILIKE :keyword", { keyword: `%${keyword}%` })
      .getMany();

    return rs.map(item => ({
      ...item,
      available: item.stock > 0,
    }));
  }
}
