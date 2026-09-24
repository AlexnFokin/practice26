import { Router } from "express";
import { container } from "@/container";
import { SubscriptionController } from "@/controllers/subscription.controller";

const router = Router();
const subscriptionController = container.getController<SubscriptionController>('subscriptionController');

// Подписаться на пользователя
router.post('/:userId', subscriptionController.subscribe);

// Отписаться от пользователя
router.delete('/:userId', subscriptionController.unsubscribe);

// Получить подписчиков пользователя
router.get('/subscribers/:userId', subscriptionController.getSubscribers);

// Получить подписки пользователя
router.get('/subscriptions/:userId', subscriptionController.getSubscriptions);

// Получить ленту постов на основе подписок
router.get('/feed/:userId', subscriptionController.getFeed);

export { router };