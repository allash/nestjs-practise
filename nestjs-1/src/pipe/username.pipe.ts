import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class UserNamePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const isTrue = value === 'john';
    if (!isTrue) {
      throw new BadRequestException('username is not john');
    }
    return value;
  }
}
