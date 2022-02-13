import { NextFunction, Request, Response } from "express"
import NotificationService from "../services/NotificationService"
class NotificationController {
    service: NotificationService
    constructor() {
        this.service = new NotificationService()
        this.getAll = this.getAll.bind(this)
        this.getAllByAccountId = this.getAllByAccountId.bind(this)
        this.get = this.get.bind(this)
        this.insert = this.insert.bind(this)
        this.update = this.update.bind(this)
        this.delete = this.delete.bind(this)
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.service.getAll(req.query)
            return res.status(response.statusCode).json(response)
        } catch (e) {
            next(e)
        }
    }
    async getAllByAccountId(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            const response = await this.service.getAllByAccountId(id)
            return res.status(response.statusCode).json(response)
        } catch (e) {
            next(e)
        }
    }

    async get(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            const response = await this.service.get(id)
            return res.status(response.statusCode).json(response)
        } catch (e) {
            next(e)
        }
    }

    async insert(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.service.insert(req.body)

            return res.status(response.statusCode).json(response)
        } catch (e) {
            next(e)
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            const response = await this.service.update(id, req.body)
            return res.status(response.statusCode).json(response)
        } catch (e) {
            next(e)
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            const response = await this.service.delete(id)
            return res.status(response.statusCode).json(response)
        } catch (e) {
            next(e)
        }
    }
}

export default NotificationController
