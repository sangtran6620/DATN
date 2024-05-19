import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ReviewEntity } from "./review.entity";
import { ItemEntity } from "../item/item.entity";
import { CreateReviewRequestBaseDto } from "./dtos/review.dto";

interface ReviewServiceInterface {
  create(c: CreateReviewRequestBaseDto, userId: string): Promise<void>;
}

@Injectable()
export class ReviewService implements ReviewServiceInterface {
  private readonly logger: Logger = new Logger(ReviewService.name);
  constructor(
    @InjectRepository(ReviewEntity)
    private reviewRepository: Repository<ReviewEntity>,
    @InjectRepository(ItemEntity)
    private itemRepository: Repository<ItemEntity>,
  ) {}

  async create(c: CreateReviewRequestBaseDto, userId: string): Promise<void> {
    try {
      const item = await this.itemRepository.findOneOrFail({
        where: { id: c.item_id },
      });

      const review = this.reviewRepository.create({
        content: c.content,
        rating: c.rating,
        item: item,
        user_id: userId,
      });
      await this.reviewRepository.save(review); // luu vao db
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findReviewsByItemId(itemId: string): Promise<ReviewEntity[]> {
    try {
      // join user by user_id
      const reviews = await this.reviewRepository.find({
        where: { item_id: itemId },
        relations: ["user"],
      });
      return reviews;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.reviewRepository.delete({
        id: id,
      }); // xoa review theo id
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
