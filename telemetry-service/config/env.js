import 'dotenv/config';

export default {
    // MQTT
    MQTT_BROKER: process.env.MQTT_BROKER || 'mqtt://172.31.253.71:1883',
    MQTT_TOPIC_DOORLOCK: process.env.MQTT_TOPIC_DOORLOCK || 'doorlock',
    KAFKA_BROKER: process.env.KAFKA_BROKER,
    MQTT_USER: process.env.MQTT_USER,
    MQTT_PASSWORD: process.env.MQTT_PASSWORD,
    TOPIC_ATTEMPTS: process.env.TOPIC_ATTEMPTS || 'attempts',
    TOPIC_ENTRANCE: process.env.TOPIC_ENTRANCE || 'entrance',
    TOPIC_LOGS: process.env.TOPIC_LOGS || 'logs',


    // Topic wildcard pour toutes les badgeuses
    MQTT_TOPIC_BADGE: process.env.MQTT_TOPIC_BADGE || 'iot/badgeuse/+/events',
    // Base des topics portes : iot/porte/{doorId}/events
    MQTT_TOPIC_DOOR_BASE: process.env.MQTT_TOPIC_DOOR_BASE || 'iot/porte',


    // on gardera ça pour plus tard quand on fera les portes
   // MQTT_TOPIC_DOORLOCK_BASE: process.env.MQTT_TOPIC_DOORLOCK_BASE || 'iot/porte'



};