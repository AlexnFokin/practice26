import { query, param, body } from 'express-validator';

export const getPostsValidator = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('page must be an integer ≥ 1')
        .toInt()
        .default(1),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('limit must be an integer between 1 and 100')
        .toInt()
        .default(10),

    query('tags')
        .optional()
        .customSanitizer((value) => {
            if (value === undefined || value === null || value === '') return undefined;
            const arr = Array.isArray(value) ? value : String(value).split(',');
            const clean = arr.map(String).filter(Boolean);
            return clean.length > 0 ? clean : undefined;
        })
        .isArray()
        .withMessage('tags must be an array or a comma-separated string'),

    query('sortBy')
        .optional()
        .isIn(['createdAt', 'updatedAt', 'title'])
        .withMessage('sortBy must be one of: createdAt, updatedAt, title'),

    query('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('sortOrder must be asc or desc'),
];

export const postIdValidator = [
    param('id').isUUID().withMessage('id must be a valid UUID'),
];

// --- переиспользуемые валидаторы для multipart ---

const tagsBodyValidator = body('tags')
    .optional()
    .custom((value) => {
        if (value === undefined || value === '') return true;
        if (Array.isArray(value)) return true;

        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed);
            } catch {
                // "node,js" — тоже валидно
                return true;
            }
        }

        return false;
    })
    .withMessage('tags должен быть массивом или строкой');

const booleanBodyValidator = (field: 'isPublic' | 'isHidden') =>
    body(field)
        .optional()
        .custom((value) => {
            if (value === undefined || value === '') return true;
            return (
                value === true ||
                value === false ||
                value === 'true' ||
                value === 'false'
            );
        })
        .withMessage(`${field} должен быть boolean`);

// --- create / update ---

export const createPostValidator = [
    body('title').notEmpty().withMessage('Заголовок обязателен'),
    body('content').notEmpty().withMessage('Контент обязателен'),
    booleanBodyValidator('isPublic'),
    booleanBodyValidator('isHidden'),
    tagsBodyValidator,
];

export const updatePostValidator = [
    body('title').optional().notEmpty(),
    body('content').optional().notEmpty(),
    booleanBodyValidator('isPublic'),
    booleanBodyValidator('isHidden'),
    tagsBodyValidator,
];