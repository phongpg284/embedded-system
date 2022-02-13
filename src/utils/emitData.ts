import { Socket } from "socket.io"

const emitData = (socket: Socket, topic: string, payload: any) => {
    socket.emit(topic, payload)
}

export default emitData
