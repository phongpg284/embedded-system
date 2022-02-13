import dayjs from "dayjs"
import { NextFunction, Request, Response } from "express"
import DeviceService from "../services/DeviceService"
import PatientService from "../services/PatientService"
import MeanStats from "../utils/MeanStats"

class PatientController {
    service: PatientService
    deviceService: DeviceService
    constructor() {
        this.service = new PatientService()
        this.deviceService = new DeviceService()
        this.getAll = this.getAll.bind(this)
        this.get = this.get.bind(this)
        this.insert = this.insert.bind(this)
        this.update = this.update.bind(this)
        this.delete = this.delete.bind(this)
        this.getByDoctorId = this.getByDoctorId.bind(this)
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.service.getAll(req.query)
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

    async getByDoctorId(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            const response = await this.service.getByDoctorId(id)
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

    createHistoryDevice = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        try {
            const device = await this.deviceService.getByPatientId(id)
            if (!device.data) return res.status(device.statusCode).json(device)

            const response = await this.deviceService.update(device.data._id, req.body)
            return res.status(response.statusCode).json(response)
        } catch (e) {
            next(e)
        }
    }

    // getHistoryDevice = async (req: Request, res: Response, next: NextFunction) => {
    //     const { id } = req.params
    //     try {
    //         const device = await this.deviceService.getByPatientId(id)
    //         if (!device.data) return res.status(device.statusCode).json(device)

    //         const response = await this.deviceService.getHistory(device.data._id)
    //         return res.status(response.statusCode).json(response)
    //     } catch (e) {
    //         next(e)
    //     }
    // }

    // getStatisticDevice = async (req: Request, res: Response, next: NextFunction) => {
    //     const { id } = req.params
    //     const { month, year, date } = req.query
    //     try {
    //         const device = await this.deviceService.getByPatientId(id)
    //         if (!device.data) return res.status(device.statusCode).json(device)
    //         const history = await this.deviceService.getHistory(device.data._id)
    //         if (date) {
    //             return res.status(history.statusCode).json(history)
    //         }
    //         if (!month || !year) return res.status(200).json({ message: "No query" })

    //         console.log(month + "-" + year)
    //         //@ts-ignore
    //         const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
    //         const endDate = dayjs(startDate).add(1, "month").toDate()
    //         const result = MeanStats(history.data, startDate, 7, endDate, "day")

    //         return res.status(200).json({
    //             message: "Success",
    //             error: false,
    //             data: result,
    //         })
    //     } catch (e) {
    //         next(e)
    //     }
    // }

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

export default PatientController
