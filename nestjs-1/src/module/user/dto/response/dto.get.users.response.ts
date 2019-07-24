export class DtoGetUsersResponse {
    id: string;
    firstName: string;
    age: number;
    email: string;

    constructor(id: string = '', email: string = '', firstName: string = '', age: number = 0) {
        this.id = id;
        this.firstName = firstName;
        this.age = age;
        this.email = email;
    }
}
