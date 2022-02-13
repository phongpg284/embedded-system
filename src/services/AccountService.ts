import mongoose, { Model } from "mongoose"
import { IResponse } from "../utils/types"
import AccountModel, { IAccount } from "../models/AccountModel"
import { hash } from "argon2"
import { IRegisterData } from "./AuthService"
class AccountService {
    private readonly model: Model<IAccount>
    constructor() {
        this.model = AccountModel
    }

    async getAll(query: any): Promise<IResponse<IAccount[]>> {
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
            const items = await this.model.find(query).sort(sortBy).skip(skip).limit(limit).select("-password")

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

    async hashPassword(password: string) {
        return await hash(password)
    }

    async get(id: string): Promise<IResponse<IAccount>> {
        try {
            const item = await this.model.findById(id).select("-password")
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
                    message: "Can't find account",
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

    async getByEmail(email: string): Promise<IResponse<IAccount>> {
        try {
            const user = await this.model.findOne({ email })
            if (user) {
                return {
                    error: false,
                    statusCode: 200,
                    data: user,
                }
            } else {
                return {
                    error: true,
                    statusCode: 400,
                    message: "Can't find account",
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

    async insert(data: IRegisterData): Promise<IResponse<Omit<IAccount, "password">>> {
        data.password = await this.hashPassword(data.password)
        try {
            const { password, ...item } = await this.model.create(data)
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
                    message: "Can't create account",
                }
            }
        } catch (errors) {
            return {
                error: true,
                statusCode: 500,
                message: "Error create account",
                errors: errors,
            }
        }
    }

    async update(id: string, data: any): Promise<IResponse<IAccount>> {
        try {
            if (data.password) {
                data.password = await this.hashPassword(data.password)
            }
            const item = await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select("-password")
            console.log(item)
            if (item)
                return {
                    error: false,
                    statusCode: 202,
                    data: item,
                    message: "Update account successfully",
                }
            else {
                return {
                    error: true,
                    statusCode: 400,
                    message: "Can't update account",
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

    async delete(id: string): Promise<IResponse<IAccount>> {
        try {
            const item = await this.model.findByIdAndDelete(id).select("-password")
            if (!item) {
                return {
                    error: true,
                    statusCode: 200,
                    message: "Account not found",
                }
            }
            return {
                error: false,
                statusCode: 202,
                data: item,
                message: "Delete account successfully",
            }
        } catch (errors) {
            throw errors
        }
    }
}

export default AccountService
