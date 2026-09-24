export class RequestAccessResponseDto {
    message!: string;

    constructor(partial: Partial<RequestAccessResponseDto> = {}) {
        Object.assign(this, partial);
    }
}