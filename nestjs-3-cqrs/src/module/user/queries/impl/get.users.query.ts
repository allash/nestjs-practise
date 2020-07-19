import { IQuery } from '@nestjs/cqrs';

export class GetUsersQuery implements IQuery {
    constructor(public readonly response: any) { }
}
