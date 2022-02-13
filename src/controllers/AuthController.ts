import { NextFunction, Request, Response } from "express"
import AuthService from "../services/AuthService"

class AuthController {
    service: AuthService
    constructor() {
        this.service = new AuthService()
        this.login = this.login.bind(this)
        this.register = this.register.bind(this)
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.service.login(req.body.email, req.body.password)
            if (response.data) return res.status(response.statusCode ?? 200).json(response.data)
            else if (response) return res.status(response.statusCode ?? 200).json(response)
            else return res.status(500).json({ message: "Server error" })
        } catch (e) {
            next(e)
        }
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.service.register(req.body)
            return res.status(response.statusCode).json(response)
        } catch (e) {
            next(e)
        }
    }
}

export default AuthController
