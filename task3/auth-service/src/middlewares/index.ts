import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const setupMiddleware = (app: express.Express): void => {
    // Основные middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(cors({
        origin: ['http://localhost:5000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    // Логирование запросов (опционально)
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });
};

export { setupMiddleware };