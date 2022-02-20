import { Server } from "socket.io"
import jwt from "jsonwebtoken"
import { JWT_KEY } from "./config"
import emitData from "./utils/emitData"
import { mqttPublishConfirmHeight, mqttPublishConfirmStats, mqttPublishInitState, mqttPublishPause, mqttPublishStart, mqttPublishStop } from "./mqtt/handler"
import { logger } from "./config/logger"

interface IDecodedJWT {
    id: string
    email: string
    role: string
    iat: number
}
export const io = new Server({
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
})

io.on("connection", (socket: any) => {
    // socket.on("token", (token: string) => {
    //     try {
    //         const decoded = jwt.verify(token, JWT_KEY)
    //         const userAccountId = (<IDecodedJWT>decoded).id
    //         socket.join(userAccountId)
    //         emitData(socket, "notification", userAccountId)
    //     } catch (err) {
    //         socket.emit("notification", "Invalid token")
    //         socket.disconnect()
    //     }
    // })
    socket.on("init_pulse/set", (id: string) => {
        try {
            mqttPublishInitState(id)
        } catch (err) {
            logger.error(err)
        }
    })
    socket.on("base_height", (payload: any) => {
        try {
            mqttPublishConfirmHeight(payload.id, payload.status)
        } catch (err) {
            logger.error(err)
        }
    })
    socket.on("parameter", (payload: any) => {
        try {
            mqttPublishConfirmStats(payload.id, payload.stats)
        } catch (err) {
            logger.error(err)
        }
    })
    socket.on("start_pulse", (payload: any) => {
        try {
            mqttPublishStart(payload.id, payload.status)
        } catch (err) {
            socket.disconnect()
        }
    })
    socket.on("pause_pulse", (payload: any) => {
        try {
            mqttPublishPause(payload.id, payload.status)
        } catch (err) {
            socket.disconnect()
        }
    })
    socket.on("stop_pulse", (payload: any) => {
        try {
            mqttPublishStop(payload.id, payload.status)
        } catch (err) {
            socket.disconnect()
        }
    })
})
