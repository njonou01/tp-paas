package fr.upec.episen.core_operational_backend.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(AppTopicsProperties.class)
public class PropsConfig {
}