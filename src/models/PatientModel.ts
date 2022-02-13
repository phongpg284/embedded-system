import { Schema, model, SchemaTypes, Types } from "mongoose"

export interface IPatient {
    _id: string
    fullName: string
    age: number
    gender: string
    email: string
    account: Schema
    pathological: string[]
    analyze: string[]
    bloodType: string
    doctor_id: string
    birth: Date
    phone: number
}

const schema = new Schema<IPatient>({
    fullName: { type: String, required: true },
    age: { type: Number },
    gender: { type: String },
    email: { type: String, required: true, match: [/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, "Please fill a valid email address"] },
    pathological: { type: [String] },
    analyze: { type: [String] },
    bloodType: { type: String },
    doctor_id: {
        type: String,
        validate: {
            validator: function (id: string) {
                if (Types.ObjectId.isValid(id)) {
                    if (String(new Types.ObjectId(id)) === id) return true
                    return false
                }
                return false
            },
            message: (props) => `${props.value} is not a valid ObjectId!`,
        },
    },
    birth: { type: Date },
    phone: { type: Number },
})

const PatientModel = model<IPatient>("Patient", schema)

export default PatientModel
