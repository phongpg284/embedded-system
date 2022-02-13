import express from "express"
import AccountController from "../controllers/AccountController"

const router = express.Router()

const accountController = new AccountController()

router.get("/", accountController.getAll)
router.get("/:id", accountController.get)
router.post("/", accountController.insert)
router.put("/:id", accountController.update)
router.delete("/:id", accountController.delete)

export { router as accountRouter }
