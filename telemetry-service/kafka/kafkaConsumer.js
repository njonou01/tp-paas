// kafka/kafkaConsumer.js
// Consomme les messages du topic "entrance" (Kafka)
// et publie un message formaté sur MQTT (topic doorlock).

import { createKafka } from './kafkaConfig.js';
import env from '../config/env.js';
import { publishMqtt } from '../mqtt/mqttClient.js';
import doorlockTemplate from '../schemas/doorlockTemplate.json' with { type: 'json' };
import logger from '../utils/logger.js';
import { buildDoorTopic } from '../mqtt/mqttClient.js';

export async function startEntranceConsumer() {
    const kafka = createKafka();
    const consumer = kafka.consumer({ groupId: 'telemetry-service-entrance' });

    // Connexion au broker Kafka
    await consumer.connect();
    logger.info(
        {
            groupId: 'telemetry-service-entrance',
            broker: env.KAFKA_BROKER,
        },
        '[KAFKA] Consumer "entrance" connecté'
    );

    // Abonnement au topic "entrance"
    await consumer.subscribe({
        topic: env.TOPIC_ENTRANCE,
        fromBeginning: false, // seulement les nouveaux messages
    });
    logger.info(
        { topic: env.TOPIC_ENTRANCE },
        '[KAFKA] Abonné au topic "entrance"'
    );

    // Boucle de consommation (stream)
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const raw = message.value?.toString() || '';

            // Log détaillé mais en DEBUG pour ne pas polluer en prod
            logger.debug(
                {
                    topic,
                    partition,
                    offset: message.offset,
                    key: message.key?.toString() || null,
                    payload: raw,
                },
                '[KAFKA] Message reçu sur "entrance"'
            );

            // Parse JSON
            let obj;
            try {
                obj = JSON.parse(raw);
            } catch (e) {
                logger.warn(
                    { error: e.message, raw },
                    '[KAFKA] JSON invalide, message ignoré'
                );
                return;
            }

            // Validation minimale
            if (!obj.badgeID || !obj.doorID) {
                logger.warn(
                    { message: obj },
                    '[KAFKA] Message incomplet (badgeID/doorID manquants), ignoré'
                );
                return;
            }

            // Construction du message pour la serrure à partir du template JSON
            const doorDeviceId = obj.doorID;
            const mqttDoorTopic = buildDoorTopic(doorDeviceId); // iot/porte/{device_id}/events

            const doorMsg = {
                ...doorlockTemplate,
                doorID: obj.doorID,
                badgeID: obj.badgeID,
                action: obj.action || doorlockTemplate.action || 'OPEN',
                timestamp: obj.timestamp || new Date().toISOString(),
            };

            logger.info(
                {
                    mqttDoorTopic,
                    doorID: doorMsg.doorID,
                    badgeID: doorMsg.badgeID,
                    action: doorMsg.action,
                },
                '[FLOW] Kafka(entrance) → MQTT(porte)'
            );

            // ⬅️ ici on publie sur le topic dynamique, plus sur un topic fixe
            publishMqtt(mqttDoorTopic, doorMsg);
        },
    });
}