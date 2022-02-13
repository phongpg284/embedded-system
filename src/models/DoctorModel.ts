import { Schema, model, SchemaTypes } from "mongoose"

export interface IDoctor {
    _id: string
    fullName: string
    age: number
    gender: string
    email: string
    department: string
    education: string
    jobPosition: string
    birth: Date
    phone: number
}

const schema = new Schema<IDoctor>({
    fullName: { type: String, required: true },
    age: { type: Number, min: 18, max: 65 },
    gender: { type: String },
    email: { type: String, required: true, match: [/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, "Please fill a valid email address"] },
    department: { type: String },
    education: { type: String },
    jobPosition: { type: String },
    birth: { type: Date },
    phone: { type: Number },
})

const DoctorModel = model<IDoctor>("Doctor", schema)

export default DoctorModel
