import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  ValidationPipe,
} from "@nestjs/common";
import { PageOptionsDto } from "../../common/dto/page-options.dto";
import { PageDto, SimpleResponse } from "../../common/dto/page.dto";

import { ReviewService } from "./review.service";
import { PageMetaDto } from "../../common/dto/page-meta.dto";
import { CreateReviewRequestBaseDto } from "./dtos/review.dto";
import { Auth } from "src/decorators";

@Controller("review")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Auth()
  @Post("/create")
  async createReview(
    @Body()
    body: CreateReviewRequestBaseDto,
    @Req() req,
  ): Promise<SimpleResponse<any>> {
    await this.reviewService.create(body, req.user.id);
    return new SimpleResponse(null, "Review created successfully");
  }
  @Delete("/:id")
  async deleteReview(@Param("id") id: string): Promise<SimpleResponse<any>> {
    await this.reviewService.delete(id);
    return new SimpleResponse(null, "Review deleted successfully");
  }

  @Get("/:itemId")
  async findReviewsByItemId(
    @Param("itemId") itemId: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<any>> {
    const r = await this.reviewService.findReviewsByItemId(itemId);

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount: 0,
    });
    return new PageDto(r, pageMetaDto);
  }
}
