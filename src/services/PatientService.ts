import mongoose, { Model } from "mongoose"
import { IResponse } from "../utils/types"
import PatientModel, { IPatient } from "../models/PatientModel"

class PatientService {
    private readonly model: Model<IPatient>
    constructor() {
        this.model = PatientModel
    }

    async getAll(query: any): Promise<IResponse<IPatient[]>> {
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
    async getByDoctorId(id: string): Promise<IResponse<IPatient[]>> {
        try {
            const user = await this.model.find({ doctor_id: id })
            if (user) {
                return {
                    error: false,
                    statusCode: 200,
                    data: user,
                }
            } else {
                return {
                    error: true,
                    statusCode: 200,
                    message: "Can't find patient(s)",
                }
            }
        } catch (errors) {
            return {
                error: true,
                statusCode: 200,
                message: errors,
            }
        }
    }

    async get(id: string): Promise<IResponse<IPatient>> {
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
                    statusCode: 400,
                    message: "Can't find patient",
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

    async insert(data: any): Promise<IResponse<IPatient>> {
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

    async update(id: string, data: any): Promise<IResponse<IPatient>> {
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
                message: "Update successfully",
            }
        } catch (errors) {
            return {
                error: true,
                statusCode: 500,
                message: errors,
            }
        }
    }

    async delete(id: string): Promise<IResponse<IPatient>> {
        try {
            const item = await this.model.findByIdAndDelete(id)
            if (!item) {
                return {
                    error: true,
                    statusCode: 200,
                    message: "Patient not found",
                }
            }
            return {
                error: false,
                statusCode: 202,
                data: item,
                message: "Delete patient successfully",
            }
        } catch (errors) {
            throw errors
        }
    }
}

export default PatientService
