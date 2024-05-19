import { MigrationInterface, QueryRunner } from "typeorm";
import { UserEntity } from "../../modules/user/user.entity";
import { CartEntity } from "../../modules/cart/cart.entity";

export class createUserCart1681056989304 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = await queryRunner.manager.find(UserEntity);
    const carts = users.map(user => {
      const cart = new CartEntity();
      return queryRunner.manager.save(cart);
    });
    const cartRecors = await Promise.all(carts);

    const userCarts = users.map((user, index) => {
      user.cart = cartRecors[index];
      return queryRunner.manager.save(user);
    });
    await Promise.all(userCarts);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
