import express from "express";
import { createEvent, getAllEvents, getMyEvents, registerForEvent } from "../controllers/events.controller.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware.js";
import { closeEvent } from "../controllers/events.controller.js";
import { getEventParticipants } from "../controllers/events.controller.js";
import { deleteEvent } from "../controllers/events.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getAllEvents);

router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    createEvent,
);

router.post("/:id/register", authMiddleware, registerForEvent);

router.get("/my-events", authMiddleware, getMyEvents);

router.patch(
  "/:id/close",
  authMiddleware,
  adminMiddleware,
  closeEvent
);

router.get(
  "/:id/participants",
  authMiddleware,
  adminMiddleware,
  getEventParticipants
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteEvent
);

export default router;