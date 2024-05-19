import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { stringify } from "querystring";
import { throwError } from "rxjs";
import {
  tap,
  catchError,
  mergeMap,
  finalize,
  map,
  combineLatestAll,
} from "rxjs/operators";

@Injectable()
export class HTTPLogger implements NestInterceptor {
  private logger: Logger = new Logger(HTTPLogger.name);
  intercept(context: ExecutionContext, next: CallHandler) {
    let log;

    const start = Date.now();
    const request = context.switchToHttp().getRequest();

    const { originalUrl, method, ip } = request;

    const userAgent = request.get("user-agent") || "";
    let d;
    return next.handle().pipe(
      catchError(err => {
        log = data => this.logger.error(data, err.stack);
        d = err.response;
        return throwError(() => {
          return err;
        });
      }),
      tap((data: any) => {
        log = data => this.logger.log(data);
        d = data;
        return data;
      }),
      finalize(() => {
        const response = context.switchToHttp().getResponse();
        response.on("finish", () => {
          const { statusCode } = response;
          const duration = Date.now() - start;
          const contentLength = response.get("content-length");
          log(
            `Request: {${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip} Response: { ${JSON.stringify(
              d,
            )} ${duration}ms }`,
          );
        });
      }),
    );
  }
}
