import { Schema, model, SchemaTypes, Types, Date } from "mongoose"

export interface IDeviceUsingHistory {
    startTime: Date
    endTime: Date
    duration: number
    restTime: number
    voltage: number
    frequency: number
    step: number
}
export interface IDevice {
    _id: string
    patient_id: string
    name: string
    voltage: number
    frequency: number
    restTime: number
    deviceUsingHistory: [IDeviceUsingHistory]
}

const schema = new Schema<IDevice>({
    patient_id: {
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
    name: { type: String, required: true },
    voltage: { type: Number },
    frequency: { type: Number },
    restTime: { type: Number },
    deviceUsingHistory: [
        {
            startTime: { type: Date, required: true },
            endTime: { type: Date, required: true },
            duration: { type: Number, required: true },
            restTime: { type: Number, required: true },
            voltage: { type: Number, required: true },
            frequency: { type: Number, required: true },
            step: { type: Number, required: true },
        },
    ],
})

const DeviceModel = model<IDevice>("Device", schema)

export default DeviceModel
