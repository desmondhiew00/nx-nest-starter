import { ForbiddenError } from "@casl/ability";
import { ArgumentsHost, Catch, ForbiddenException, Logger } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { JsonWebTokenError } from "jsonwebtoken";
import { PrismaError } from "../error";

@Catch()
export class AppExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger("Error");

  // @ts-ignore
  override catch(exception: Error, host: ArgumentsHost) {
    this.logger.error(exception, exception.stack);
    const contextType = host.getType() as string;

    if (exception instanceof JsonWebTokenError) {
      exception = new ForbiddenException("Invalid Token");
    }

    if (contextType === "graphql") {
      return new PrismaError(exception);
    }

    super.catch(exception, host);
  }
}

ForbiddenError.setDefaultMessage((error) => {
  const id = error?.subject?.id;
  return `Insufficient Permissions: ${error.action}-${error.subjectType}${id && `(id:${id})`}`;
});
