package fr.upec.episen.core_operational_backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.topics")
public record AppTopicsProperties(String in, String out, String logs) {
}