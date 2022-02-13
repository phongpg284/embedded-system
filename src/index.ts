import express from "express"
import cors from "cors"
import { PORT, SOCKETIO_PORT } from "./config"
import { Server } from "socket.io"
import "./database"
import { accountRouter } from "./routes/account.route"
import { authRouter } from "./routes/auth.route"
import { doctorRouter } from "./routes/doctor.route"
import { patientRouter } from "./routes/patient.route"
import { deviceRouter } from "./routes/device.route"
import { notificationRouter } from "./routes/notification.route"
import { io } from "./socket"
const app = express()
const port = process.env.PORT || 4000
app.use(
    express.urlencoded({
        extended: true,
    })
)
app.use(express.json())
app.use(cors())
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", ["*"])
    res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
    res.append("Access-Control-Allow-Headers", "Content-Type")
    res.append("Access-Control-Expose-Headers", "Content-Range")
    res.append("Content-Range", "bytes : 0-9/*")
    next()
})

app.listen(PORT, () => {
    console.log(`Successfully connect to port: ${port}`)
})

app.use("/api/account", accountRouter)
app.use("/api/auth", authRouter)
app.use("/api/doctor", doctorRouter)
app.use("/api/patient", patientRouter)
app.use("/api/device", deviceRouter)
app.use("/api/notification", notificationRouter)



io.listen(SOCKETIO_PORT)
