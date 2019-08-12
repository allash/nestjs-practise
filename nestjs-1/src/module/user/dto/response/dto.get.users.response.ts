export class DtoGetUsersResponse {
    id: string;
    firstName: string;
    lastName: string;
    email: string;

    constructor(id: string = '', email: string = '', firstName: string = '', lastName: string = '') {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }
}
