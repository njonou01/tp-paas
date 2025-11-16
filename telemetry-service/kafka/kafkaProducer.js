// ──────────────────────────────────────────────
//  kafkaProducer.js
//  Gère la connexion au broker Kafka
//  + l'envoi des messages dans un topic.
// ──────────────────────────────────────────────

import { createKafka } from './kafkaConfig.js';
import env from '../config/env.js';
import logger from '../utils/logger.js';

// Singleton du producteur Kafka
let producer;

/**
 * Retourne un producteur Kafka connecté (lazy singleton)
 */
export async function getProducer() {
    try {
        if (!producer) {
            const kafka = createKafka();
            producer = kafka.producer();

            logger.info(
                { broker: env.KAFKA_BROKER },
                'Connexion du producteur Kafka…'
            );

            await producer.connect();

            logger.info(
                { broker: env.KAFKA_BROKER },
                'Producteur Kafka connecté'
            );
        }

        return producer;

    } catch (err) {
        logger.error(
            { error: err.message },
            'Échec lors de la création/connexion du producteur Kafka'
        );
        throw err;
    }
}

/**
 * Envoie un message JSON dans le topic définis dans .env
 * @param {Object} messageObj
 */
export async function sendToKafka(messageObj) {
    try {
        const p = await getProducer();

        await p.send({
            topic: env.TOPIC_ATTEMPTS,
            messages: [{ value: JSON.stringify(messageObj) }],
        });

        logger.debug(
            { topic: env.TOPIC_ATTEMPTS, payload: messageObj }, 'Message envoyé à Kafka');

        // 2) Envoi dans log
        await p.send({
            topic: env.TOPIC_LOGS, // ajoute TOPIC_LOG dans ton .env
            messages: [
                {
                    value: json,
                    headers: { source: "attempts" },
                },
            ],
        });

        logger.debug(
            { topic: env.TOPIC_LOGS, payload: messageObj },
            'Message forwardé dans le topic log'
        );

    } catch (err) {
        logger.error(
            { error: err.message, topic: env.TOPIC_ATTEMPTS },
            'Erreur lors de l’envoi du message Kafka'
        );
        throw err;
    }
}