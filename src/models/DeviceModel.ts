import { Schema, model } from "mongoose"

export interface IStat {
    data: number
    createdAt: Date
}
export interface INode {
    temperature: IStat[]
    humidity: IStat[]
}
export interface IDevicePower {
    lipoBatt: IStat[]
    solar: IStat[]
}
export interface IEnvironment {
    humidity: IStat[]
}
export interface IDevice {
    _id: string
    name: string
    node_1: INode 
    node_2: INode 
    environment: IEnvironment 
    devicePower: IDevicePower
}

const schema = new Schema<IDevice>({
    name: { type: String, required: true },
    node_1:  { 
        temperature: [{
            data: Number,
            createdAt: Date
        }],
        humidity: [{
            data: Number,
            createdAt: Date
        }]
    }, 
    node_2:  { 
        temperature: [{
            data: Number,
            createdAt: Date
        }],
        humidity: [{
            data: Number,
            createdAt: Date
        }]
    }, 
    environment:  { 
        humidity: [{
            data: Number,
            createdAt: Date
        }]
    }, 
    devicePower:  { 
        lipoBatt: [{
            data: Number,
            createdAt: Date
        }],
        solar: [{
            data: Number,
            createdAt: Date
        }]
    }, 
})

const DeviceModel = model<IDevice>("Device", schema)

export default DeviceModel
