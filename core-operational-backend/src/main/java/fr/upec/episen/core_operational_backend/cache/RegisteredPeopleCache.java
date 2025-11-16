package fr.upec.episen.core_operational_backend.cache;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class RegisteredPeopleCache {
    private static final String REGISTERED_SET = "badges:active";
    private final StringRedisTemplate redis;

    public RegisteredPeopleCache(StringRedisTemplate redis) {
        this.redis = redis;
    }

    public boolean isRegistered(String badgeId) {
        return Boolean.TRUE.equals(redis.opsForSet().isMember(REGISTERED_SET, badgeId));
    }
}