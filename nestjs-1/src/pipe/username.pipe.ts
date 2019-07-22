import { PipeTransform, ArgumentMetadata, BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class UserNamePipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        const isTrue = value === 'boris';
        if (!isTrue) { throw new BadRequestException('user name is not boris'); }
        return value;
    }
}
