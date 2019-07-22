export class DtoGetUsersResponse {
    id: string;
    firstName: string;
    age: number;

    constructor(id: string = '', firstName: string = '', age: number = 0) {
        this.id = id;
        this.firstName = firstName;
        this.age = age;
    }
}
