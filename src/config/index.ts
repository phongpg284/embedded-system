require("dotenv").config()

export const PORT = process.env.PORT || 4000
export const SOCKETIO_PORT = 4004
export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
export const JWT_KEY = process.env.JWT_KEY || "abcabc"
export const { MQTT_BROKER = "mqtt://localhost:1883", MQTT_BRAND = "MANDevices" } = process.env
