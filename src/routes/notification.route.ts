import express from "express"
import NotificationController from "../controllers/NotificationController"

const router = express.Router()

const notificationController = new NotificationController()

router.get("/", notificationController.getAll)
router.get("/accountId/:id", notificationController.getAllByAccountId)
router.get("/:id", notificationController.get)
router.post("/", notificationController.insert)
router.put("/:id", notificationController.update)
router.delete("/:id", notificationController.delete)

export { router as notificationRouter }
