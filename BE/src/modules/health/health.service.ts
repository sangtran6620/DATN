import { Inject, Injectable } from '@nestjs/common';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class HealthService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger, // private awsS3Service: AwsS3Service, // private commandBus: CommandBus,
  ) {}

  healthCheck(): string {
    return 'ok';
  }
}
