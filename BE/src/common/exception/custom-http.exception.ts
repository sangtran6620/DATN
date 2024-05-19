import { HttpException, HttpStatus } from "@nestjs/common";
import { ExceptionTitleList } from "src/common/constants/exception-title-list.constants";
import { StatusCodesList } from "src/common/constants/status-codes-list.constants";

export interface BaseHttpResponse {
  statusCode: number;
  code: number;
  data?: any;
  timestamp?: Date;
  message?: string;
  path?: string;
}

export interface CustomHttpExceptionResponse extends BaseHttpResponse {
  args?: any;
}

export class CustomHttpException extends HttpException {
  constructor(payload: CustomHttpExceptionResponse) {
    const exceptionResponse: CustomHttpExceptionResponse = {
      message: payload.message || ExceptionTitleList.InternalServerError,
      code: payload.code || StatusCodesList.InternalServerError,
      statusCode: payload.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      // error: payload.error || 'Something went wrong',
      data: payload.data,
      args: payload.args,
    };

    super(
      exceptionResponse,
      payload.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
