import { Schema, model } from "mongoose"
import jwt from "jsonwebtoken"
import { JWT_KEY } from "../config"

const jwtKey = JWT_KEY;

export interface IAuth {
    user: string
    token: string
}

export const AuthSchema = new Schema(
    {
        token: {
            type: String,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },
    },
    { timestamps: true }
)
const AuthModel = model<IAuth>("Auths", AuthSchema)

export default AuthModel
