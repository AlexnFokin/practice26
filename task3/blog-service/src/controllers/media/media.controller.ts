import { IMediaService } from "@/services/media/IMediaService";
import { IMediaController } from "./IMediaController";
import { NextFunction } from "express";
import { ApiError } from "@/exceptions/api.error";

export class MediaController implements IMediaController {
    constructor(private readonly mediaService: IMediaService) { }
    
    uploadImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.headers['x-user-id'] as string;
            if (!userId) throw ApiError.UnauthorizedError();
            if (!req.file) throw ApiError.BadRequest('Файл не передан');

            const result = await this.mediaService.uploadImage(req.file);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };
}