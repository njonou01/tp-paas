package fr.upec.episen.core_operational_backend.messaging;

import fr.upec.episen.core_operational_backend.cache.RegisteredPeopleCache;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class TelemetryListener {

    private final RegisteredPeopleCache registeredPeopleCache;
    private final DecisionPublisher decisionPublisher;
    private static final Logger logger = LoggerFactory.getLogger(TelemetryListener.class);

    public TelemetryListener(RegisteredPeopleCache registeredPeopleCache,
            DecisionPublisher decisionPublisher) {
        this.registeredPeopleCache = registeredPeopleCache;
        this.decisionPublisher = decisionPublisher;
    }

    @KafkaListener(topics = "${app.topics.in}", groupId = "${spring.kafka.consumer.group-id}")
    public void receive(TelemetryEvent event) {

        String badgeId = event.badgeID();
        String doorId = event.doorID();
        String timestamp = event.timestamp();

        logger.info("Reçu depuis telemetry : {} / {} / {}", badgeId, doorId, timestamp);
        
        try {
            boolean isRegistered = registeredPeopleCache.isRegistered(badgeId);

            if (isRegistered) {
                decisionPublisher.publishAllowed(badgeId, doorId);
            } else {
                decisionPublisher.publishRejected(badgeId, doorId);
            }

        } catch (Exception e) {
            logger.error("Erreur pendant le traitement du message telemetry pour badge {}", badgeId, e);
        }
    }
}