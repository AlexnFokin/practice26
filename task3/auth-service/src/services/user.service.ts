import { User } from '@/models/user.model';
import { ApiError } from '@/exceptions/api.error';
import { UserProfileDto } from '@/dtos/userprofile.dto';

class UserService {
    async getProfile(userId: string) {
        const user = await User.findByPk(userId);

        if (!user) {
            throw ApiError.NotFound('Пользователь не найден');
        }

        return new UserProfileDto(user);
    }

    async updateProfile(userId: string, data: { firstName?: string; email?: string }) {
        const user = await User.findByPk(userId);

        if (!user) {
            throw ApiError.NotFound('Пользователь не найден');
        }

        await user.update(data);
        return new UserProfileDto(user);
    }
}

export { UserService };