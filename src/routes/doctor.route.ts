import express from "express"
import DoctorController from "../controllers/DoctorController"

const router = express.Router()

const doctorController = new DoctorController()

router.get("/", doctorController.getAll)
router.get("/:id", doctorController.get)
router.post("/", doctorController.insert)
router.put("/:id", doctorController.update)
router.delete("/:id", doctorController.delete)

export { router as doctorRouter }
