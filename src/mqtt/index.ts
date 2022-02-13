import mqtt from 'mqtt';
import { MQTT_BRAND, MQTT_BROKER } from '../config';
import { logger } from '../config/logger';
import { mqttClient, mqttMessageHandler } from './handler';
const DEVICE_TOPIC = `${MQTT_BRAND}/+/+`;
const NODE_TOPIC = `${MQTT_BRAND}/+/+/+`;
const PROPERTY_TOPIC = `${MQTT_BRAND}/+/+/+/+`;
const ATTRIBUTE_TOPIC = `${MQTT_BRAND}/+/+/+/+/+`;

/* mqtt://localhost:1883 */
// export const mqttClient = mqtt.connect(MQTT_BROKER);

// mqttClient.on(
//   'connect',
//   (
//     connectionAck: mqtt.Packet & {
//       retain: boolean;
//       qos: 0 | 1 | 2;
//       dup: boolean;
//       topic: string | null;
//       payload: string | null;
//       sessionPresent: boolean;
//       returnCode: number;
//     }
//   ) => {
//     logger.info('Connected to mqtt broker!');
//     if (!connectionAck.sessionPresent) {
//       mqttClient?.subscribe(DEVICE_TOPIC, { qos: 2 }, (error, response) => {
//         if (error) {
//           logger.error(`Subscribe DEVICE_TOPIC error: ${error}`);
//         } else {
//           response.forEach(({ topic }) => {
//             logger.info(`Subscribe DEVICE_TOPIC successfully: ${topic}`);
//           });
//         }
//       });
//       mqttClient?.subscribe(PROPERTY_TOPIC, { qos: 2 }, (error, response) => {
//         if (error) {
//           logger.error(`Subscribe PROPERTY_TOPIC error: ${error}`);
//         } else {
//           response.forEach(({ topic }) => {
//             logger.info(`Subscribe PROPERTY_TOPIC successfully: ${topic}`);
//           });
//         }
//       });
//       mqttClient?.subscribe(NODE_TOPIC, { qos: 2 }, (error, response) => {
//         if (error) {
//           logger.error(`Subscribe NODE_TOPIC error: ${error}`);
//         } else {
//           response.forEach(({ topic }) => {
//             logger.info(`Subscribe NODE_TOPIC successfully: ${topic}`);
//           });
//         }
//       });
//       mqttClient?.subscribe(ATTRIBUTE_TOPIC, { qos: 2 }, (error, response) => {
//         if (error) {
//           logger.error(`Subscribe ATTRIBUTE_TOPIC error: ${error}`);
//         } else {
//           response.forEach(({ topic }) => {
//             logger.info(`Subscribe ATTRIBUTE_TOPIC successfully: ${topic}`);
//           });
//         }
//       });
//     }
//   }
// );

// mqttClient.on('reconnect', () => {
//   logger.info(`Reconnect to MQTT Broker ${MQTT_BROKER}`);
// });

// mqttClient.on('disconnect', () => {
//   logger.info('Disconnect to MQTT Broker');
// });

// mqttClient.on('offline', () => {
//   logger.info('MQTT Client offline');
// });

// mqttClient.on('error', (error) => {
//   logger.error('Connect MQTT Broker error: ', error);
// });

// mqttClient.on('end', () => {
//   logger.info('MQTT client end');
// });

// mqttClient.on('packetsend', () => {
//   logger.info('MQTT client send packet');
// });

// mqttClient.on('packetreceive', () => {
//   logger.info('MQTT client receive packet');
// });

// mqttClient.on('message', async (topic, payload) => {
//   const payloadData = String(payload);
//   const topicElement = topic.split('/');
//   logger.info('topic element: ');
//   logger.info(topicElement);
//   console.log('payload:' + payload);
//   try {
//     await mqttMessageHandler(topicElement, payload.toString());
//   } catch (error) {
//     logger.error(error);
//     return Error(error);
//   }
// });
