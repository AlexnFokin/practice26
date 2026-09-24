import { IMediaService } from "./IMediaService";
import { ApiError } from "@/exceptions/api.error";
import { UploadedFileDto } from "@/dtos/UploadedFileDto";
import sharp from "sharp";

export class MediaService implements IMediaService {

    async uploadImage(file: Express.Multer.File): Promise<UploadedFileDto> {
        if (!file) {
            throw ApiError.BadRequest('Файл не передан');
        }

        const url = `/media/posts/${file.filename}`;

        let width: number | undefined;
        let height: number | undefined;

        try {
            const metadata = await sharp(file.path).metadata();
            width = metadata.width;
            height = metadata.height;
        } catch {
            // sharp не смог прочитать — пропускаем метаданные
        }

        return new UploadedFileDto({
            url,
            size: file.size,
            mimetype: file.mimetype,
            width,
            height,
        });
    }
}