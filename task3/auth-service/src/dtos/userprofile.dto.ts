class UserProfileDto {
    id: string;
    email: string;
    firstName: string;
    updatedAt: Date;

    constructor(model: {
        id: string;
        email: string;
        firstName: string;
        updatedAt: Date;
    }) {
        this.id = model.id;
        this.email = model.email;
        this.firstName = model.firstName;
        this.updatedAt = model.updatedAt;
    }
}

export { UserProfileDto };