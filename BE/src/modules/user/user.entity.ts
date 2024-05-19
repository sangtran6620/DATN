import { Exclude } from "class-transformer";
import {
  Column,
  Entity,
  OneToOne,
  BeforeInsert,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { BaseEntity } from "../../common/abstract.entity";
import { UserRole } from "../../common/enum/user-role";
import { generateHash } from "../../common/utils";
import { VirtualColumn } from "../../decorators";
import { UserDto } from "./dtos/user.dto";
import { UserSettingsEntity } from "./user-settings.entity";
import { CartEntity } from "../cart/cart.entity";
import { ReviewEntity } from "../review/review.entity";

@Entity({ name: "users" })
export class UserEntity extends BaseEntity {
  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  avatar?: string;

  // TODO: Next use rbac
  @Column({ enum: UserRole, default: UserRole.ADMINSTRATOR })
  role: UserRole;

  @VirtualColumn()
  fullName?: string;

  @OneToOne(() => UserSettingsEntity, userSettings => userSettings.user)
  settings?: UserSettingsEntity;

  @OneToOne(() => CartEntity)
  @JoinColumn({ name: "cart_id" })
  cart: CartEntity;

  @Column({ name: "cart_id" })
  cartId: string;

  @OneToMany(() => ReviewEntity, r => r.user)
  reviews: ReviewEntity[];

  @BeforeInsert()
  hashPassword() {
    this.password = generateHash(this.password);
  }

  toDto(): UserDto {
    delete this.password;
    return {
      ...this,
      fullName: this.fullName,
    };
  }
}
