import { UserDto } from '@/dtos/user.dto';
import { User } from '../models/user.model';
const bcrypt = require('bcrypt');
const saltRounds = 10;
import { TokenService as TokenServiceClass } from './token.service';
import { ApiError } from '@/exceptions/api.error';
const TokenService = new TokenServiceClass();

class AuthService {
    async register(data) {
        const { email, password, firstName } = data;

        const candidate = await User.findOne({ where: { email } });
        if (candidate) {
            throw ApiError.BadRequest('Пользователь с таким email уже существует');
        }

        const salt = await bcrypt.genSalt(saltRounds);
        const passHash = await bcrypt.hash(password, salt);

        const user = await User.create({
            email: email,
            password: passHash,
            firstName: firstName,
        })

        const userDto = new UserDto(user)

        const tokens = await TokenService.generateTokens({ ...userDto });
        await TokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }

    async login(data) {
        const { email, password } = data;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw ApiError.BadRequest('Пользователь не найден');
        }

        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Учетные данные не верны');
        }

        const userDto = new UserDto(user);
        const tokens = TokenService.generateTokens({ ...userDto });
        await TokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken) {
        return await TokenService.removeToken(refreshToken);
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const userData = TokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await TokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        const user = await User.findOne({
            where: { id: userData.id }
        })

        if (!user) {
            throw ApiError.UnauthorizedError();
        }

        const userDto = new UserDto(user);
        const tokens = TokenService.generateTokens({ ...userDto });
        await TokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto
        }
    }
}

export { AuthService }