package com.rpg.backend.controllers;

import com.rpg.backend.models.UserEntity;
import com.rpg.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> payload) {
        String identifier = payload.get("identifier");
        String userTag = payload.get("userTag");

        if (userRepository.findByIdentifier(identifier).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Identificador já existe na Guilda."));
        }

        UserEntity user = new UserEntity();
        user.setId(UUID.randomUUID().toString());
        user.setIdentifier(identifier);
        user.setUserTag(userTag);
        
        userRepository.save(user);

        String fakeToken = "ey.jwt.fake." + user.getId();

        Map<String, Object> response = new HashMap<>();
        response.put("playerId", user.getId());
        response.put("userTag", user.getUserTag());
        response.put("token", fakeToken);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String identifier = payload.get("identifier");

        Optional<UserEntity> userOpt = userRepository.findByIdentifier(identifier);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Alma não listada nos registros do Cofre."));
        }

        UserEntity user = userOpt.get();
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String fakeToken = "ey.jwt.fake." + user.getId();

        Map<String, Object> response = new HashMap<>();
        response.put("playerId", user.getId());
        response.put("userTag", user.getUserTag());
        response.put("token", fakeToken);

        return ResponseEntity.ok(response);
    }
}

