import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { PageDto } from "../../common/dto/page.dto";
import { CategoryEntity } from "./category.entity";
import { CategoryService } from "./category.service";
import {
  CategoryDto,
  CreateChildCategoryDto,
  CreateParentCategoryDto,
  DeleteCategoryDto,
  UpdateCategoryDto,
} from "./dtos/category.dto";

@Controller("cat")
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get("/")
  async getCategories(): Promise<PageDto<CategoryDto>> {
    return await this.categoryService.getCategories();
  }

  @Post("/create-parent-category")
  async createCategory(@Body() request: CreateParentCategoryDto) {
    return await this.categoryService.createParentCategory(request);
  }

  @Post("/create-child-category")
  async createChildCategory(@Body() request: CreateChildCategoryDto) {
    return await this.categoryService.createChildCategory(request);
  }

  @Put("/update-category")
  async updateCategory(@Body() request: UpdateCategoryDto) {
    return await this.categoryService.updateCategory(request);
  }

  @Delete("/:id")
  async deleteCategory(@Param("id") id: string) {
    return await this.categoryService.deleteCategory(id);
  }
}
