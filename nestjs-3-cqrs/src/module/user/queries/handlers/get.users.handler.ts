import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUsersQuery } from '../impl/get.users.query';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> { 

    constructor(
        private readonly eventListener: EventListener
    ) {

    }
    async execute(query: GetUsersQuery) {
     }
}
