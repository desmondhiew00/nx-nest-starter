import { ArgumentsHost, Catch, ForbiddenException, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { JsonWebTokenError } from 'jsonwebtoken';
import { ForbiddenError } from '@casl/ability';

@Catch()
export class AppExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger('Error');

  override catch(exception: Error, host: ArgumentsHost) {
    this.logger.error(exception, exception.stack);
    if (exception instanceof JsonWebTokenError) {
      exception = new ForbiddenException('Invalid Token');
    }

    const contextType = host.getType() as any;
    if (contextType === 'graphql') return;
    super.catch(exception, host);
  }
}

ForbiddenError.setDefaultMessage((error) => {
  const id = error?.subject?.id;
  return `Insufficient Permissions: ${error.action}-${error.subjectType}${id && `(id:${id})`}`;
});
