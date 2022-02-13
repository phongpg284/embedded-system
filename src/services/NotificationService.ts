import mongoose, { Model } from "mongoose"
import { IResponse } from "../utils/types"
import NotificationModel, { INotification } from "../models/NotificationModel"
import { io } from "./../socket"
class NotificationService {
    private readonly model: Model<INotification>
    constructor() {
        this.model = NotificationModel
    }

    async getAll(query: any): Promise<IResponse<INotification[]>> {
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
                throw new Error("Unable to generate mongoose id with content")
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

    async get(id: string): Promise<IResponse<INotification>> {
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
                    message: "Can't find notification",
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

    async getAllByAccountId(id: string): Promise<IResponse<INotification[]>> {
        try {
            const items = await this.model.find({ account_id: id })
            return {
                error: false,
                statusCode: 200,
                data: items,
            }
        } catch (errors) {
            return {
                error: true,
                statusCode: 500,
                errors,
            }
        }
    }
    async insert(data: any): Promise<IResponse<INotification>> {
        try {
            const item = await this.model.create(data)
            console.log(data)
            io.in(data.account_id).emit("notification", JSON.stringify(data))
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
                    message: "Can't create notification",
                }
            }
        } catch (errors) {
            return {
                error: true,
                statusCode: 500,
                message: "Error create notification",
                errors: errors,
            }
        }
    }

    async update(id: string, data: any): Promise<IResponse<INotification>> {
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

    async delete(id: string): Promise<IResponse<INotification>> {
        try {
            const item = await this.model.findByIdAndDelete(id)
            if (!item) {
                return {
                    error: true,
                    statusCode: 400,
                    message: "Notification not found",
                }
            }
            return {
                error: false,
                statusCode: 202,
                data: item,
                message: "Delete successfully",
            }
        } catch (errors) {
            throw errors
        }
    }
}

export default NotificationService
