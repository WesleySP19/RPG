package com.rpg.backend.controllers;

import com.rpg.backend.models.SessionEntity;
import com.rpg.backend.repositories.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    @Autowired
    private SessionRepository sessionRepository;

    @GetMapping("/")
    public List<SessionEntity> getAllSessions() {
        return sessionRepository.findAll();
    }

    @PostMapping("/")
    public ResponseEntity<SessionEntity> createOrUpdateSession(@RequestBody SessionEntity session) {
        if (session.getId() == null || session.getId().isEmpty()) {
            session.setId("SESS-" + Math.random() * 1000);
        }
        SessionEntity saved = sessionRepository.save(session);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SessionEntity> getSession(@PathVariable String id) {
        return sessionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

