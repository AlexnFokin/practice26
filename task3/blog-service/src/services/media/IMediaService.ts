import { UploadedFileDto } from "@/dtos/UploadedFileDto";

export interface IMediaService {
    uploadImage(file: Express.Multer.File): Promise<UploadedFileDto>;
}