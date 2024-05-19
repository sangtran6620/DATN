import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import type {
  CategoryDto,
  CreateChildCategoryDto,
  CreateParentCategoryDto,
  UpdateCategoryDto,
} from "./dtos/category.dto";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { CategoryEntity } from "./category.entity";
import { PageDto } from "../../common/dto/page.dto";
import { PageMetaDto } from "../../common/dto/page-meta.dto";
import { CustomHttpException } from "../../common/exception/custom-http.exception";
import { StatusCodesList } from "../../common/constants/status-codes-list.constants";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private catRepository: Repository<CategoryEntity>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  // get categories and count items in each category
  async getCategories(): Promise<PageDto<any>> {
    const categories = await this.catRepository.find({ relations: ["items"] });

    const categoryCounts = categories.map(category => {
      return {
        ...category,
        item_count: category.items.length,
      };
    });

    const pageMetaDto = new PageMetaDto({
      itemCount: categories.length,
    });

    return new PageDto<any>(categoryCounts, pageMetaDto);
  }

  async createParentCategory(
    parentCategory: CreateParentCategoryDto,
  ): Promise<CategoryEntity> {
    return this.catRepository.save(parentCategory);
  }

  async createChildCategory(childCategory: CreateChildCategoryDto) {
    return this.catRepository.save(childCategory);
  }

  async updateCategory(category: UpdateCategoryDto) {
    const { id, ...updateCategory } = category;
    const { affected } = await this.catRepository.update(id, updateCategory);
    if (affected === 0) {
      throw new BadRequestException(`Category with id ${id} not found`);
    }
    return this.catRepository.findOne({ where: { id } });
  }

  async deleteCategory(id: string) {
    const { affected } = await this.catRepository.delete(id);
    if (affected === 0) {
      throw new CustomHttpException({
        code: StatusCodesList.CategoryNotFound,
        message: "",
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
  }
}
