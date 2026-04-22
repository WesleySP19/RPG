package com.rpg.backend.controllers;

import com.rpg.backend.models.UserEntity;
import com.rpg.backend.repositories.UserRepository;
import com.rpg.backend.services.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
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

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> payload) {
        String identifier = payload.get("identifier");
        String userTag = payload.get("userTag");
        String password = payload.get("password");

        if (password == null || password.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "A senha é obrigatória para forjar sua alma."));
        }

        if (userRepository.findByIdentifier(identifier).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Identificador já existe na Guilda."));
        }

        UserEntity user = new UserEntity();
        user.setId(UUID.randomUUID().toString());
        user.setIdentifier(identifier);
        user.setUserTag(userTag);
        user.setPassword(passwordEncoder.encode(password));
        
        userRepository.save(user);

        String token = jwtService.generateToken(user.getIdentifier());

        Map<String, Object> response = new HashMap<>();
        response.put("playerId", user.getId());
        response.put("userTag", user.getUserTag());
        response.put("token", token);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String identifier = payload.get("identifier");
        String password = payload.get("password");

        Optional<UserEntity> userOpt = userRepository.findByIdentifier(identifier);
        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Credenciais inválidas nos registros do Cofre."));
        }

        UserEntity user = userOpt.get();
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtService.generateToken(user.getIdentifier());

        Map<String, Object> response = new HashMap<>();
        response.put("playerId", user.getId());
        response.put("userTag", user.getUserTag());
        response.put("token", token);

        return ResponseEntity.ok(response);
    }
}

