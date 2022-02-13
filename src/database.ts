require("dotenv").config()

import mongoose from "mongoose"
import { handleMessageMqtt } from "./mqtt/handler"
class Connection {
    constructor() {
        const url = process.env.MONGODB_URI || `mongodb://localhost:27017/embedded`
        console.log("Establish new connection with url", url)
        mongoose.Promise = global.Promise
        mongoose.connect(url).then(() => {
            handleMessageMqtt()
        })
    }
}

export default new Connection()
