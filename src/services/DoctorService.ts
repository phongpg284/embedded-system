import mongoose, { Model } from "mongoose"
import { IResponse } from "../utils/types"
import DoctorModel, { IDoctor } from "../models/DoctorModel"

class DoctorService {
    private readonly model: Model<IDoctor>
    constructor() {
        this.model = DoctorModel
    }

    async getAll(query: any): Promise<IResponse<IDoctor[]>> {
        let { skip, limit, sortBy } = query

        skip = skip ? Number(skip) : 0
        limit = limit ? Number(limit) : 10
        sortBy = sortBy ? sortBy : { createdAt: -1 }

        delete query.skip
        delete query.limit
        delete query.sortBy

        if (query._id) {
            try {
                query._id = new mongoose.mongo.ObjectId(query._id)
            } catch (error) {
                throw new Error("Not able to generate mongoose id with content")
            }
        }

        try {
            const items = await this.model.find(query).sort(sortBy).skip(skip).limit(limit)

            const total = await this.model.count()

            return {
                error: false,
                statusCode: 200,
                data: items,
                total,
            }
        } catch (errors) {
            return {
                error: true,
                statusCode: 500,
                errors,
            }
        }
    }

    async get(id: string): Promise<IResponse<IDoctor>> {
        try {
            const item = await this.model.findById(id)

            if (item) {
                return {
                    error: false,
                    statusCode: 200,
                    data: item,
                }
            } else {
                return {
                    error: true,
                    statusCode: 200,
                    message: "Can't find doctor",
                }
            }
        } catch (errors) {
            return {
                error: true,
                statusCode: 500,
                message: errors,
            }
        }
    }

    async insert(data: any): Promise<IResponse<IDoctor>> {
        try {
            const item = await this.model.create(data)
            if (item) {
                return {
                    error: false,
                    statusCode: 201,
                    data: item,
                }
            } else {
                return {
                    error: true,
                    statusCode: 500,
                    message: "Can't create doctor",
                }
            }
        } catch (errors) {
            return {
                error: true,
                statusCode: 500,
                message: "Error create doctor",
                errors: errors,
            }
        }
    }

    async update(id: string, data: any): Promise<IResponse<IDoctor>> {
        try {
            const item = await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true })
            if (!item) {
                return {
                    statusCode: 500,
                    message: "Update failed",
                    error: true,
                }
            }
            return {
                error: false,
                statusCode: 202,
                data: item,
                message: "Update doctor successfully",
            }
        } catch (errors) {
            return {
                error: true,
                statusCode: 500,
                message: errors,
            }
        }
    }

    async delete(id: string): Promise<IResponse<IDoctor>> {
        try {
            const item = await this.model.findByIdAndDelete(id)
            if (!item) {
                return {
                    error: true,
                    statusCode: 200,
                    message: "Doctor not found",
                }
            }
            return {
                error: false,
                statusCode: 202,
                data: item,
                message: "Delete doctor successfully",
            }
        } catch (errors) {
            throw errors
        }
    }
}

export default DoctorService
