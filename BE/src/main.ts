import {
  ClassSerializerInterceptor,
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import * as helmet from "helmet";
import rateLimit from "express-rate-limit";
import * as compression from "compression";

import { AppModule } from "./app.module";
import { SharedModule } from "./shared/services/shared.module";
import { ApiConfigService } from "./shared/services/api-config.service";
import { HTTPLogger } from "./common/interceptor/logger";

async function bootstrap() {
  // initializeTransactionalContext();
  // patchTypeORMRepositoryWithBaseRepository();

  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.select(SharedModule).get(ApiConfigService);

  // app.use(helmet.default());
  app.setGlobalPrefix("/api");

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10000,
    }),
  );

  app.use(compression());

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    configService.isLogRequest && new HTTPLogger(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      exceptionFactory: errors => new UnprocessableEntityException(errors),
    }),
  );

  const port = configService.appConfig.port;

  await app.listen(port);
  console.info(`Server running on port ${port} 👍`);
}
bootstrap();
