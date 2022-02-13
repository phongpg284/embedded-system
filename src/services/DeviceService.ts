import mongoose, { Model } from "mongoose"
import { IResponse } from "../utils/types"
import DeviceModel, { IDevice } from "../models/DeviceModel"
import { logger } from "../config/logger"

class DeviceService {
    private readonly model: Model<IDevice>
    constructor() {
        this.model = DeviceModel
    }

    async getAll(query: any): Promise<IResponse<IDevice[]>> {
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

    async get(id: string): Promise<IResponse<IDevice>> {
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
                    message: "Can't find device",
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

    // async getHistory(id: string): Promise<IResponse<IDeviceUsingHistory[]>> {
    //     try {
    //         const item = await this.get(id)
    //         if (!item.data) {
    //             return {
    //                 error: true,
    //                 statusCode: 200,
    //                 message: "Can't find device",
    //             }
    //         } else {
    //             const history = item.data.deviceUsingHistory
    //             return {
    //                 error: false,
    //                 statusCode: 200,
    //                 data: history,
    //             }
    //         }
    //     } catch (errors) {
    //         return {
    //             error: true,
    //             statusCode: 500,
    //             message: errors,
    //         }
    //     }
    // }

    async getByPatientId(id: string): Promise<IResponse<IDevice>> {
        try {
            const user = await this.model.findOne({ patient_id: id })
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
                    message: "Can't find device",
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

    async getByName(name: string): Promise<IResponse<IDevice>> {
        try {
            const item = await this.model.findOne({ name: name })
            if (item)
                return {
                    error: false,
                    statusCode: 200,
                    data: item,
                }
            else {
                return {
                    error: true,
                    statusCode: 200,
                    message: "Can't find device",
                }
            }
        } catch (errors) {
            return {
                error: true,
                statusCode: 500,
                errors,
            }
        }
    }
    async insert(data: any): Promise<IResponse<IDevice>> {
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
                    message: "Can't create device",
                }
            }
        } catch (errors) {
            return {
                error: true,
                statusCode: 500,
                message: "Error create device",
                errors: errors,
            }
        }
    }

    async updateStat(id: string, data: any, key: string, stat: string): Promise<IResponse<IDevice>> {
        try {
            const { node_1, node_2, environment, devicePower,...updateData } = data
            let item 
            if (key === "node_1") {
                if (stat === "temperature")
                item = await this.model.findByIdAndUpdate(
                    id,
                    {
                        $set: updateData,
                        $push: { "node_1.temperature": node_1.temperature},
                    },
                )    
                if (stat === "humidity")
                item = await this.model.findByIdAndUpdate(
                    id,
                    {
                        $set: updateData,
                        $push: { "node_1.humidity": node_1.humidity},
                    },
                )
            }  
            else if (key === "node_2") {
                if (stat === "temperature")
                item = await this.model.findByIdAndUpdate(
                    id,
                    {
                        $set: updateData,
                        $push: { "node_2.temperature": node_2.temperature},
                    },
                )    
                if (stat === "humidity")
                item = await this.model.findByIdAndUpdate(
                    id,
                    {
                        $set: updateData,
                        $push: { "node_2.humidity": node_2.humidity},
                    },
                )
            }  
            else if (key === "environment") {
                if (stat === "humidity")
                item = await this.model.findByIdAndUpdate(
                    id,
                    {
                        $set: updateData,
                        $push: { "environment.humidity": environment.humidity},
                    },
                )
            }  
            else if (key === "devicePower") {
                if (stat === "lipoBatt")
                item = await this.model.findByIdAndUpdate(
                    id,
                    {
                        $set: updateData,
                        $push: { "devicePower.lipoBatt": devicePower.lipoBatt},
                    },
                )
                if (stat === "solar")
                item = await this.model.findByIdAndUpdate(
                    id,
                    {
                        $set: updateData,
                        $push: { "devicePower.solar": devicePower.solar},
                    },
                )
            }  
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
            logger.error(errors)
            return {
                error: true,
                statusCode: 500,
                message: errors,
            }
        }
    }


    async update(id: string, data: any): Promise<IResponse<IDevice>> {
        try {
            const { node_1, node_2, environment, devicePower,...updateData } = data
            console.log(node_1)
            const item = await this.model.findByIdAndUpdate(
                id,
                {
                    $set: updateData,
                    $push: { "node_1.temperature": node_1.temperature },
                },
                { new: true, runValidators: true }
            )
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
            logger.error(errors)
            return {
                error: true,
                statusCode: 500,
                message: errors,
            }
        }
    }

    async delete(id: string): Promise<IResponse<IDevice>> {
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
                message: "Delete successfully",
            }
        } catch (errors) {
            throw errors
        }
    }
}

export default DeviceService
