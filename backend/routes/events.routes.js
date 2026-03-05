import express from "express";
import { createEvent, getAllEvents, getMyEvents, registerForEvent } from "../controllers/events.controller.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllEvents);

router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    createEvent,
);

router.post("/:id/register", authMiddleware, registerForEvent);

router.get("/my-events", authMiddleware, getMyEvents);

export default router;