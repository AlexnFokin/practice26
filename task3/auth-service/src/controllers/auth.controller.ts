import { AuthService as AuthServiceClass } from "@/services/auth.service";
const AuthService = new AuthServiceClass();
const REFRESH_COOKIE_NAME = "refreshToken";
class AuthController {
    async register(req, res, next) {
        try {
            const body = req.body;

            const userData = await AuthService.register(body);
            res.cookie(REFRESH_COOKIE_NAME, userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })

            res.status(200).json(userData)
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const body = req.body;
            const userData = await AuthService.login(body);

            res.cookie(REFRESH_COOKIE_NAME, userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })
            res.status(200).json(userData);
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const result = await AuthService.logout(refreshToken);
            res.clearCookie(REFRESH_COOKIE_NAME);
            res.status(200).json({
                message: 'Вы успешно вышли из системы',
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await AuthService.refresh(refreshToken);

            res.cookie(REFRESH_COOKIE_NAME, userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })
            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }
}

export { AuthController };