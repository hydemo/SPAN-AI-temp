import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { isMongoId } from 'class-validator';

import { ApiErrorCode } from '../enum/api-error-code.enum';
import { ApiException } from '../exception/api.exception';

@Injectable()
export class MongodIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!isMongoId(value)) {
      throw new ApiException('无效的ID', ApiErrorCode.USER_ID_INVALID, 406);
    }
    return value;
  }
}
