export class UploadedFileDto {
    url!: string;
    size?: number;
    mimetype?: string;
    width?: number;
    height?: number;

    constructor(partial: Partial<UploadedFileDto> = {}) {
        Object.assign(this, partial);
    }
}