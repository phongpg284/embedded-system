import { NextFunction, Request, Response } from "express"
import DeviceService from "../services/DeviceService"

class DeviceController {
    service: DeviceService
    constructor() {
        this.service = new DeviceService()
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this.service.getAll(req.query)
            return res.status(response.statusCode).json(response)
        } catch (e) {
            next(e)
        }
    }
    getByPatientId = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        try {
            const response = await this.service.getByPatientId(id)
            return res.status(response.statusCode).json(response)
        } catch (e) {
            next(e)
        }
    }
    getHistory = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        try {
            console.log(this)
            const response = await this.service.getHistory(id)
            return res.status(response.statusCode).json(response)
        } catch (e) {
            next(e)
        }
    }
    getByName = async (req: Request, res: Response, next: NextFunction) => {
        const { name } = req.params
        try {
            const response = await this.service.getByName(name)
            return res.status(response.statusCode).json(response)
        } catch (e) {
            next(e)
        }
    }

    get = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        try {
            const response = await this.service.get(id)
            return res.status(response.statusCode).json(response)
        } catch (e) {
            next(e)
        }
    }

    insert = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this.service.insert(req.body)

            return res.status(response.statusCode).json(response)
        } catch (e) {
            next(e)
        }
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        try {
            const response = await this.service.update(id, req.body)
            return res.status(response.statusCode).json(response)
        } catch (e) {
            next(e)
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        try {
            const response = await this.service.delete(id)
            return res.status(response.statusCode).json(response)
        } catch (e) {
            next(e)
        }
    }
}

export default DeviceController
