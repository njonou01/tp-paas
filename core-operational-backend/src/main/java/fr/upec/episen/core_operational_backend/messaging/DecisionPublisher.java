package fr.upec.episen.core_operational_backend.messaging;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.upec.episen.core_operational_backend.config.AppTopicsProperties;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import java.time.Instant;

@Component
public class DecisionPublisher {

    private final KafkaTemplate<String, String> kafka;
    private final AppTopicsProperties topics;
    private final ObjectMapper objectMapper;

    public DecisionPublisher(KafkaTemplate<String, String> kafka,
            AppTopicsProperties topics,
            ObjectMapper objectMapper) {
        this.kafka = kafka;
        this.topics = topics;
        this.objectMapper = objectMapper;
    }

    public void publishAllowed(String badgeId, String gateId) {
        sendDecision(badgeId, gateId, "ALLOWED");
    }

    public void publishRejected(String badgeId, String gateId) {
        sendDecision(badgeId, gateId, "REJECTED");
    }

    private void sendDecision(String badgeId, String gateId, String actionStatus) {
        EntranceEvent event = new EntranceEvent(
                badgeId,
                gateId,
                Instant.now().toString(),
                actionStatus
        );

        try {
            String json = objectMapper.writeValueAsString(event);

            if ("ALLOWED".equals(actionStatus)) {
                kafka.send(topics.out(), badgeId, json);
            }

            kafka.send(topics.logs(), badgeId, json);

        } catch (JsonProcessingException e) {
            throw new RuntimeException("Erreur lors de la sérialisation JSON de EntranceEvent", e);
        }
    }
}