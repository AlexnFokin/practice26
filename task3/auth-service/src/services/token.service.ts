var jwt = require('jsonwebtoken');
import { ApiError } from '@/exceptions/api.error';
import { Token } from '@/models/token.model';

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
        return {
            accessToken,
            refreshToken
        };
    }

    async saveToken(userId: string, refreshToken: string) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        const tokenData = await Token.findOne({ where: { userId } });

        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            tokenData.expiresAt = expiresAt;
            await tokenData.save();
            return tokenData;
        }

        const token = await Token.create({
            userId,
            refreshToken,
            expiresAt,
        });

        return token;
    }

    async removeToken(refreshToken: string) {
        const tokenData = await Token.destroy({
            where: { refreshToken }
        });

        if (tokenData === 0) {
            throw ApiError.NotFound('Данные о входе не найден');
        }

        return { success: true };
    }

    validateAccessToken(token: string) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }

    validateRefreshToken(token: string) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }

    async findToken(refreshToken: string) {
        const tokenData = await Token.findOne({
            where: { refreshToken }
        });

        return tokenData;
    }
}

export { TokenService };