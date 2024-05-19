import {
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { FindOptionsWhere } from "typeorm";
import { Repository } from "typeorm";

import { PageDto } from "../../common/dto/page.dto";
// import { ValidatorService } from '../../shared/services/validator.service';
import { UserRegisterDto } from "../auth/dto/UserRegisterDto";
import type { UserDto } from "./dtos/user.dto";
import type { UsersPageOptionsDto } from "./dtos/users-page-options.dto";
import { UserEntity } from "./user.entity";
import { UserSettingsEntity } from "./user-settings.entity";
import { queryPagination } from "../../common/utils";
import { PageMetaDto } from "../../common/dto/page-meta.dto";
import { CustomHttpException } from "../../common/exception/custom-http.exception";
import { StatusCodesList } from "../../common/constants/status-codes-list.constants";
import { UserRole } from "../../common/enum/user-role";
import { CartService } from "../cart/cart.service";

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);
  constructor(
    private readonly cartService: CartService,
    @InjectRepository(UserSettingsEntity)
    private userSettingRepository: Repository<UserSettingsEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>, // private validatorService: ValidatorService,
  ) {}

  findOne(findData: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
    return this.userRepository.findOneBy(findData);
  }

  async findByUsernameOrEmail(
    options: Partial<{ username: string; email: string }>,
  ): Promise<UserEntity | null> {
    const queryBuilder = this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.settings", "settings");

    if (options.email) {
      queryBuilder.orWhere("user.email = :email", {
        email: options.email,
      });
    }

    if (options.username) {
      queryBuilder.orWhere("user.username = :username", {
        username: options.username,
      });
    }

    return queryBuilder.getOne();
  }

  // @Transactional()
  async createUser(
    userRegisterDto: UserRegisterDto,
    // file?: IFile,
  ): Promise<UserEntity> {
    const findUser = await this.userRepository.findOneBy({
      email: userRegisterDto.email,
      role: UserRole.ADMINSTRATOR,
    });
    if (findUser) {
      throw new CustomHttpException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Email ${userRegisterDto.email} already exists`,
        code: StatusCodesList.EmailAlreadyExists,
      });
    }

    const userCart = await this.cartService.createCart();

    const user = this.userRepository.create(userRegisterDto);
    user.cart = userCart;

    const userRecord = await this.userRepository.save(user);
    // if (file && !this.validatorService.isImage(file.mimetype)) {
    //   throw new FileNotImageException();
    // }

    // if (file) {
    //   user.avatar = await this.awsS3Service.uploadImage(file);
    // }
    const userSettings = this.userSettingRepository.create({
      isEmailVerified: false,
      userId: userRecord.id,
    });

    user.settings = await this.userSettingRepository.save(userSettings);

    return user;
  }

  async getUsers(
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    const queryBuilder = this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.settings", "settings");

    const [users, itemCount] = await queryPagination<UserEntity>({
      query: queryBuilder,
      o: pageOptionsDto,
    });

    return new PageDto<UserDto>(
      users,
      new PageMetaDto({
        itemCount,
        pageOptionsDto,
      }),
    );
  }

  async getUser(userId: string): Promise<UserDto> {
    const queryBuilder = this.userRepository.createQueryBuilder("user");

    queryBuilder.where("user.id = :userId", { userId });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      this.logger.error(`User with id ${userId} not found`);
      throw new InternalServerErrorException();
    }

    return {
      ...userEntity,
    };
  }
}
