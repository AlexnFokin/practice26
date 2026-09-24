class UserDto {
    id: string;
    email: string;

    constructor(model: {
        id: string;
        email: string;
    }) {
        this.email = model.email;
        this.id = model.id;
    }
}

export { UserDto }