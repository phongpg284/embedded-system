import express from "express"
import PatientController from "./../controllers/PatientController"

const router = express.Router()

const patientController = new PatientController()

router.get("/", patientController.getAll)
router.get("/:id", patientController.get)
// router.get("/device-statistic/:id", patientController.getStatisticDevice)
// router.get("/device-history/:id", patientController.getHistoryDevice)
router.get("/doctorId/:id", patientController.getByDoctorId)
router.post("/", patientController.insert)
router.post("/device-history/:id", patientController.createHistoryDevice)
router.post("/device-update/:id", patientController.createHistoryDevice)
router.put("/:id", patientController.update)
router.delete("/:id", patientController.delete)

export { router as patientRouter }
