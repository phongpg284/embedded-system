import express from "express"
import DeviceController from "../controllers/DeviceController"

const router = express.Router()

const deviceController = new DeviceController()

router.get("/", deviceController.getAll)
router.get("/patientId/:id", deviceController.getByPatientId)
router.get("/:name", deviceController.getByName)
router.get("/history/:id", deviceController.getHistory)
router.get("/:id", deviceController.get)
router.post("/", deviceController.insert)
router.put("/:id", deviceController.update)
router.delete("/:id", deviceController.delete)

export { router as deviceRouter }
