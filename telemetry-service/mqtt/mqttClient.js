// mqtt/mqttClient.js
// Gestion de la connexion MQTT (unique), de l’abonnement et de la publication.

import mqtt from 'mqtt';
import env from '../config/env.js';
import logger from '../utils/logger.js';

let client; // Singleton : une seule connexion MQTT pour tout le service

/**
 * Construit les options de connexion MQTT (auth incluse si présente)
 */
function buildMqttOptions() {
    const options = {
        reconnectPeriod: 2000,  // tente une reconnexion toutes les 2s
        connectTimeout: 10_000, // délai max avant timeout
    };

    if (env.MQTT_USER && env.MQTT_PASSWORD) {
        options.username = env.MQTT_USER;
        options.password = env.MQTT_PASSWORD;
        logger.info(
            { username: env.MQTT_USER },
            '[MQTT] Auth activée (username/password)'
        );
    } else {
        logger.warn('[MQTT] Aucune auth configurée (MQTT_USER/MQTT_PASSWORD absents)');
    }

    return options;
}

/**
 * Connexion MQTT (réutilisable pour subscribe OU publish)
 */
export function connectMqtt() {
    if (client) return client;

    const options = buildMqttOptions();

    logger.info({ broker: env.MQTT_BROKER }, '[MQTT] Connexion au broker');

    client = mqtt.connect(env.MQTT_BROKER, options);

    // Événements MQTT
    client.on('connect', () => {
        logger.info('[MQTT] Connecté au broker');
    });

    client.on('reconnect', () => {
        logger.warn('[MQTT] Tentative de reconnexion…');
    });

    client.on('close', () => {
        logger.warn('[MQTT] Connexion fermée');
    });

    client.on('error', (err) => {
        logger.error({ error: err.message }, '[MQTT] Erreur de connexion');
    });

    return client;
}

/**
 * Abonnement MQTT + callback (flux MQTT → Kafka)
 * @param onMessage (callback)
 * @param topic (string)
 */
export function startMqtt(onMessage, topic = env.MQTT_TOPIC_BADGE) {
    const c = connectMqtt();

    c.subscribe(topic, (err) => {
        if (err) {
            logger.error({ topic, error: err.message }, '[MQTT] Échec abonnement');
            return;
        }
        logger.info({ topic }, '[MQTT] Abonné au topic');
    });

    c.on('message', (t, payload) => {
        const message = payload.toString();

        logger.debug(
            { topic: t, payload: message },
            '[MQTT] Message reçu'
        );

        try {
            // extraction du device_id depuis le topic iot/badgeuse/{device_id}/events
            const parts = t.split('/');
            const deviceId = parts[2]; // "badgeuse-entree-1" par ex.

            onMessage({ topic: t, deviceId, message });
        } catch (e) {
            logger.error({ error: e.message }, '[MQTT] Erreur dans le handler du message');
        }
    });
}

/**
 * Publie un message sur MQTT (flux Kafka → MQTT)
 * @param {string} topic
 * @param {object|string} messageObj
 */
export function publishMqtt(topic, messageObj) {
    const c = connectMqtt();

    const payload =
        typeof messageObj === 'string'
            ? messageObj
            : JSON.stringify(messageObj);

    c.publish(topic, payload, { qos: 0 }, (err) => {
        if (err) {
            logger.error(
                { topic, error: err.message, payload },
                '[MQTT] Erreur publication'
            );
        } else {
            logger.info(
                { topic, payload },
                '[MQTT] Message publié'
            );
        }
    });
}

export function buildDoorTopic(doorId) {
    return `${env.MQTT_TOPIC_DOOR_BASE}/${doorId}/events`;
}