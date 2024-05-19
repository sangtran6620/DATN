import {
  BadRequestException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { CustomHttpException } from "../exception/custom-http.exception";
import { StatusCodesList } from "../constants/status-codes-list.constants";

@Injectable()
export class IsArrayOrObject implements PipeTransform<any> {
  transform(value: any) {
    if (Array.isArray(value)) {
      return value;
    } else if (typeof value === "object" && value !== null) {
      return [value];
    }
    throw new CustomHttpException({
      statusCode: HttpStatus.BAD_REQUEST,
      code: StatusCodesList.InvalidRequest,
    });
  }
}
