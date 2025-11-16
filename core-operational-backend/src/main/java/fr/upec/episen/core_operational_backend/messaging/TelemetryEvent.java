package fr.upec.episen.core_operational_backend.messaging;

public record TelemetryEvent(
        String badgeID,
        String doorID,
        String timestamp) {
}