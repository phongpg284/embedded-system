import { ObjectId } from "mongodb"
import { logger } from "../config/logger"
import { MQTT_BRAND, MQTT_BROKER } from "../config"
import mqtt from "mqtt"
import DeviceService from "../services/DeviceService"
import { io } from "../socket"
const DEVICE_TOPIC = `${MQTT_BRAND}/+/+`
const NODE_TOPIC = `${MQTT_BRAND}/+/+/+`
const PROPERTY_TOPIC = `${MQTT_BRAND}/+/+/+/+`
const ATTRIBUTE_TOPIC = `${MQTT_BRAND}/+/+/+/+/+`
export const mqttClient = mqtt.connect(MQTT_BROKER)
mqttClient.on(
    "connect",
    (
        connectionAck: mqtt.Packet & {
            retain: boolean
            qos: 0 | 1 | 2
            dup: boolean
            topic: string | null
            payload: string | null
            sessionPresent: boolean
            returnCode: number
        }
    ) => {
        logger.info("Connected to mqtt broker!")
        if (!connectionAck.sessionPresent) {
            mqttClient?.subscribe(DEVICE_TOPIC, { qos: 2 }, (error, response) => {
                if (error) {
                    logger.error(`Subscribe DEVICE_TOPIC error: ${error}`)
                } else {
                    response.forEach(({ topic }) => {
                        logger.info(`Subscribe DEVICE_TOPIC successfully: ${topic}`)
                    })
                }
            })
            mqttClient?.subscribe(PROPERTY_TOPIC, { qos: 2 }, (error, response) => {
                if (error) {
                    logger.error(`Subscribe PROPERTY_TOPIC error: ${error}`)
                } else {
                    response.forEach(({ topic }) => {
                        logger.info(`Subscribe PROPERTY_TOPIC successfully: ${topic}`)
                    })
                }
            })
            mqttClient?.subscribe(NODE_TOPIC, { qos: 2 }, (error, response) => {
                if (error) {
                    logger.error(`Subscribe NODE_TOPIC error: ${error}`)
                } else {
                    response.forEach(({ topic }) => {
                        logger.info(`Subscribe NODE_TOPIC successfully: ${topic}`)
                    })
                }
            })
            mqttClient?.subscribe(ATTRIBUTE_TOPIC, { qos: 2 }, (error, response) => {
                if (error) {
                    logger.error(`Subscribe ATTRIBUTE_TOPIC error: ${error}`)
                } else {
                    response.forEach(({ topic }) => {
                        logger.info(`Subscribe ATTRIBUTE_TOPIC successfully: ${topic}`)
                    })
                }
            })
        }
    }
)

mqttClient.on("reconnect", () => {
    logger.info(`Reconnect to MQTT Broker ${MQTT_BROKER}`)
})

mqttClient.on("disconnect", () => {
    logger.info("Disconnect to MQTT Broker")
})

mqttClient.on("offline", () => {
    logger.info("MQTT Client offline")
})

mqttClient.on("error", (error) => {
    logger.error("Connect MQTT Broker error: ", error)
})

mqttClient.on("end", () => {
    logger.info("MQTT client end")
})

// mqttClient.on('packetsend', () => {
//   logger.info('MQTT client send packet');
// });

// mqttClient.on('packetreceive', () => {
//   logger.info('MQTT client receive packet');
// });

export const handleMessageMqtt = () => {
    mqttClient.on("message", async (topic, payload) => {
        const topicElement = topic.split("/")
        logger.info("topic element: ")
        logger.info(topicElement)
        console.log("payload:" + payload)
        try {
            await mqttMessageHandler(topicElement, payload.toString())
        } catch (error) {
            logger.error(error)
            throw new Error(error)
        }
    })
}

export async function mqttMessageHandler(topicElement: string[], payload: string) {
    try {
        const deviceObject = new DeviceService()
        const endpoint = topicElement[topicElement.length - 1]
        const deviceName = topicElement[1]
        const key = topicElement[2]
        if (deviceName === "Roof_Garden") {
            if (endpoint === "$name") {
                const device = await deviceObject.getByName(payload)
                if (!device) {
                    logger.error("Device exist")
                    return
                }
                await deviceObject.insert({
                    name: "Roof_Garden",
                    node_1: {
                        temperature: [],
                        humidity: []
                    },
                    node_2: {
                        temperature: [],
                        humidity: []
                    },
                    environment: {
                        humidity: []
                    },
                    devicePower: {
                        lipoBatt: [],
                        solar: []
                    },
                    createdAt: new ObjectId().getTimestamp(),
                    updatedAt: new ObjectId().getTimestamp(),
                })
                return
            }
        }

        console.log(key, "heh")
        const updatedDevice = (await deviceObject.getByName(deviceName))?.data
        if (updatedDevice) {
            switch (key) {
                case "Node_1_Environment":
                    if (endpoint === "Temperature")
                    await deviceObject.updateStat(updatedDevice._id.toString(), {
                        updatedAt: new ObjectId().getTimestamp(),
                        node_1: {
                            temperature: {
                                data: parseFloat(payload),
                                createdAt: new ObjectId().getTimestamp(),
                            } 
                        },
                    }, "node_1", "temperature")
                    if (endpoint === "Humidity")
                    await deviceObject.updateStat(updatedDevice._id.toString(), {
                        updatedAt: new ObjectId().getTimestamp(),
                        node_1: {
                            humidity: {
                                data: parseFloat(payload),
                                createdAt: new ObjectId().getTimestamp(),
                            } 
                        },
                    }, "node_1", "humidity")
                    break
                case "Node_2_Environment":
                    if (endpoint === "Temperature")
                    await deviceObject.updateStat(updatedDevice._id.toString(), {
                        updatedAt: new ObjectId().getTimestamp(),
                        node_2: {
                            temperature: {
                                data: parseFloat(payload),
                                createdAt: new ObjectId().getTimestamp(),
                            } 
                        },
                    }, "node_2", "temperature")
                    if (endpoint === "Humidity")
                    await deviceObject.updateStat(updatedDevice._id.toString(), {
                        updatedAt: new ObjectId().getTimestamp(),
                        node_2: {
                            humidity: {
                                data: parseFloat(payload),
                                createdAt: new ObjectId().getTimestamp(),
                            } 
                        },
                    }, "node_2", "humidity")
                    break
                case "Dirt_Environment":
                    if (endpoint === "Humidity")
                    await deviceObject.updateStat(updatedDevice._id.toString(), {
                        updatedAt: new ObjectId().getTimestamp(),
                        environment: {
                            humidity: {
                                data: parseFloat(payload),
                                createdAt: new ObjectId().getTimestamp(),
                            } 
                        },
                    }, "environment", "humidity")
                    break
                case "Device_Power":
                    if (endpoint === "LipoBatt")
                    await deviceObject.updateStat(updatedDevice._id.toString(), {
                        updatedAt: new ObjectId().getTimestamp(),
                        devicePower: {
                            LipoBatt: {
                                data: parseFloat(payload),
                                createdAt: new ObjectId().getTimestamp(),
                            } 
                        },
                    }, "devicePower", "lipoBatt")
                    if (endpoint === "Solar")
                    await deviceObject.updateStat(updatedDevice._id.toString(), {
                        updatedAt: new ObjectId().getTimestamp(),
                        devicePower: {
                            solar: {
                                data: parseFloat(payload),
                                createdAt: new ObjectId().getTimestamp(),
                            } 
                        },
                    }, "devicePower", "solar")
                    break
            }
        }
    } catch (error) {
        logger.error(error)
        throw new Error(error)
    }
}

/* Poperty:
 * 1: max_current
 * 2: min_current
 * 3: max_freq
 * 4: min_freq
 * 5: max_height
 * 6: height_threshold
 */
export async function mqttPublishThreshold(property: number, value: number, deviceId: string) {
    try {
        const deviceObject = new DeviceService()
        const updatedDevice = (await deviceObject.get(deviceId)).data
        if (updatedDevice) {
            const deviceName = updatedDevice.name as string
            console.log("threshold:" + deviceName)
            switch (property) {
                case 1:
                    mqttClient.publish(MQTT_BRAND + "/" + deviceName + "/human" + "/max_current/set", value.toString(), { qos: 2, retain: true })
                    await deviceObject.update(deviceId, {
                        updatedAt: new ObjectId().getTimestamp(),
                        maxCurrent: value,
                    })
                    break
                case 2:
                    mqttClient.publish(MQTT_BRAND + "/" + deviceName + "/human" + "/min_current/set", value.toString(), { qos: 2, retain: true })
                    await deviceObject.update(deviceId, {
                        updatedAt: new ObjectId().getTimestamp(),
                        minCurrent: value,
                    })
                    break
                case 3:
                    mqttClient.publish(MQTT_BRAND + "/" + deviceName + "/human" + "/max_freq/set", value.toString(), { qos: 2, retain: true })
                    await deviceObject.update(deviceId, {
                        updatedAt: new ObjectId().getTimestamp(),
                        maxFreq: value,
                    })
                    break
                case 4:
                    mqttClient.publish(MQTT_BRAND + "/" + deviceName + "/human" + "/min_freq/set", value.toString(), { qos: 2, retain: true })
                    await deviceObject.update(deviceId, {
                        updatedAt: new ObjectId().getTimestamp(),
                        minFreq: value,
                    })
                    break
                case 5:
                    mqttClient.publish(MQTT_BRAND + "/" + deviceName + "/human" + "/max_height/set", value.toString(), { qos: 2, retain: true })
                    await deviceObject.update(deviceId, {
                        updatedAt: new ObjectId().getTimestamp(),
                        maxHeight: value,
                    })
                    break
                case 6:
                    mqttClient.publish(MQTT_BRAND + "/" + deviceName + "/human" + "/height_threshold/set", value.toString(), { qos: 2, retain: true })
                    await deviceObject.update(deviceId, {
                        updatedAt: new ObjectId().getTimestamp(),
                        heightThreshold: value,
                    })
                    break
            }
        }
    } catch (error) {
        logger.error(error)
        throw new Error(error)
    }
}

export async function mqttPublishInitState(deviceId: string) {
    const deviceObject = new DeviceService()
    const updatedDevice = (await deviceObject.get(deviceId)).data
    const deviceName = updatedDevice?.name as string
    mqttClient.publish(MQTT_BRAND + "/" + deviceName + "/human" + "/init_pulse/set", "", { qos: 2 })
}

export async function mqttPublishConfirmHeight(deviceId: string, status: boolean) {
    const deviceObject = new DeviceService()
    const updatedDevice = (await deviceObject.get(deviceId)).data
    const deviceName = updatedDevice?.name as string
    mqttClient.publish(MQTT_BRAND + "/" + deviceName + "/human" + "/base_height/set", status ? "1" : "0", { qos: 2 })
}

export async function mqttPublishConfirmStats(deviceId: string, payload: any) {
    const deviceObject = new DeviceService()
    const updatedDevice = (await deviceObject.get(deviceId)).data
    const deviceName = updatedDevice?.name as string
    mqttClient.publish(MQTT_BRAND + "/" + deviceName + "/human" + "/parameter/set", JSON.stringify(payload), { qos: 2 })
}

export async function mqttPublishStart(deviceId: string, payload: string) {
    const deviceObject = new DeviceService()
    const updatedDevice = (await deviceObject.get(deviceId)).data
    const deviceName = updatedDevice?.name as string
    mqttClient.publish(MQTT_BRAND + "/" + deviceName + "/human" + "/start_pulse/set", payload, { qos: 2 })
}

export async function mqttPublishPause(deviceId: string, payload: string) {
    const deviceObject = new DeviceService()
    const updatedDevice = (await deviceObject.get(deviceId)).data
    const deviceName = updatedDevice?.name as string
    mqttClient.publish(MQTT_BRAND + "/" + deviceName + "/human" + "/pause_pulse/set", payload, { qos: 2 })
}

export async function mqttPublishStop(deviceId: string, payload: string) {
    const deviceObject = new DeviceService()
    const updatedDevice = (await deviceObject.get(deviceId)).data
    const deviceName = updatedDevice?.name as string
    mqttClient.publish(MQTT_BRAND + "/" + deviceName + "/human" + "/stop_pulse/set", payload, { qos: 2 })
}

// export async function mqttPublishReqPosition(deviceId: string) {
//     const deviceObject = new Devices()
//     const updatedDevice = await deviceObject.getDevice(deviceId)
//     const deviceName = updatedDevice.name as string
//     mqttClient.publish(MQTT_BRAND + "/" + deviceName + "/human" + "/requestPos", "", {
//         qos: 2,
//         retain: true,
//     })
// }

// export async function mqttPublishRecord(downloadUrl: string, fileName: string, deviceId: string) {
//     const deviceObject = new Devices()
//     const updatedDevice = await deviceObject.getDevice(deviceId)
//     const deviceName = updatedDevice.name as string
//     logger.info(downloadUrl)
//     mqttClient.publish(MQTT_BRAND + "/" + deviceName + "/human" + "/Record", JSON.stringify({ url: downloadUrl, name: fileName }), { qos: 2 })
// }
