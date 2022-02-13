import { createLogger, format, transports } from "winston"

export const logger = createLogger({
    transports: [
        new transports.Console({
            format: format.combine(
                format.timestamp(),
                format.colorize({
                    all: true,
                    colors: {
                        info: "green",
                        warn: "yellow",
                        error: "red",
                    },
                }),
                format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
            ),
        }),
    ],
})
