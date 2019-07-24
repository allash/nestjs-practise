export class DtoError {
    message: string;
    params: string[];

    constructor(message: string, params: string[] = []) {
        this.message = message;
        this.params = params;
    }
}
