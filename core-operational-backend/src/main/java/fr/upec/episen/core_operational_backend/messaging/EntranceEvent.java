package fr.upec.episen.core_operational_backend.messaging;

public record EntranceEvent(
        String badgeID,
        String doorID,
        String timestamp,
        String action) {
}