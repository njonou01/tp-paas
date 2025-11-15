// index.js
import 'dotenv/config'; // charge les variables du .env dans process.env
import env from './config/env.js';

import { startMqtt } from './mqtt/mqttClient.js';
import { sendToKafka } from './kafka/kafkaProducer.js';
import { startEntranceConsumer } from './kafka/kafkaConsumer.js';

// Template JSON pour construire le message "attempts"
import attemptsTemplate from './schemas/attemptsTemplate.json' with { type: 'json' };

// Logger centralisé (Pino + multi-stream)
import logger from './utils/logger.js';


logger.info('──────────────────────────────────────────────');
logger.info('[BOOT] Telemetry Service starting...');
logger.info({ kafkaBroker: env.KAFKA_BROKER }, '[BOOT] Kafka broker');
logger.info({ mqttBroker: env.MQTT_BROKER }, '[BOOT] MQTT broker');
logger.info(
    { topicAttempts: env.TOPIC_ATTEMPTS, topicEntrance: env.TOPIC_ENTRANCE },
    '[BOOT] Kafka topics'
);
logger.info(
    { mqttBadgeTopic: env.MQTT_TOPIC_BADGE, mqttDoorBase: env.MQTT_TOPIC_DOOR_BASE },
    '[BOOT] MQTT topics'
);
logger.info('──────────────────────────────────────────────');

// ───────────────────────────────────────────────
// FLUX 1 : MQTT → Kafka (attempts)
// ───────────────────────────────────────────────

startMqtt(async ({ topic, deviceId, message }) => {
    logger.info({ topic, deviceId, rawMessage: message }, '[FLOW MQTT→Kafka] Reçu depuis MQTT');

    let parsed;

    // 1️⃣ Parse JSON
    try {
        parsed = JSON.parse(message);
    } catch (err) {
        logger.warn(
            { error: err.message, rawMessage: message },
            '[FLOW MQTT→Kafka] JSON invalide, message ignoré'
        );
        return;
    }

    // 2️⃣ Validation basique
    if (!parsed.badgeID || !parsed.doorID) {
        logger.warn(
            { parsed },
            '[FLOW MQTT→Kafka] Tentative invalide : badgeID ou doorID manquant'
        );
        return;
    }

    // 3️⃣ Construction du message selon le template JSON
    const attemptMsg = {
        ...attemptsTemplate,
        badgeID: parsed.badgeID,
        doorID: parsed.doorID,
        timestamp: parsed.timestamp || new Date().toISOString(),
    };

    // 4️⃣ Envoi dans Kafka
    try {
        await sendToKafka(attemptMsg);
        logger.info(
            { topic: env.TOPIC_ATTEMPTS, message: attemptMsg },
            '[FLOW MQTT→Kafka] Message envoyé dans Kafka'
        );
    } catch (err) {
        logger.error(
            { error: err.message, topic: env.TOPIC_ATTEMPTS, message: attemptMsg },
            '[FLOW MQTT→Kafka] Échec envoi Kafka'
        );
    }
});

// ───────────────────────────────────────────────
// FLUX 2 : Kafka (entrance) → MQTT (doorlock)
// ───────────────────────────────────────────────

startEntranceConsumer().catch(err => {
    logger.error(
        { error: err.message },
        '[BOOT] Impossible de démarrer le consumer "entrance"'
    );
});

// ───────────────────────────────────────────────
// Shutdown propre
// ───────────────────────────────────────────────

for (const sig of ['SIGINT', 'SIGTERM']) {
    process.on(sig, () => {
        logger.info({ signal: sig }, '[BOOT] Signal reçu, arrêt du service…');
        process.exit(0);
    });
}