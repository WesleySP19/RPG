package com.rpg.backend.controllers;

import com.rpg.backend.models.CharacterEntity;
import com.rpg.backend.repositories.CharacterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/characters")
public class CharacterController {

    @Autowired
    private CharacterRepository characterRepository;

    @GetMapping("/player/{playerId}")
    public ResponseEntity<List<CharacterEntity>> getMyCharacters(@PathVariable String playerId) {
        List<CharacterEntity> chars = characterRepository.findByPlayerId(playerId);
        return ResponseEntity.ok(chars);
    }

    @PostMapping("/")
    public ResponseEntity<CharacterEntity> saveCharacter(@RequestBody CharacterEntity character) {
        if(character.getId() == null || character.getId().isEmpty()) {
            character.setId("char_" + System.currentTimeMillis());
        }
        CharacterEntity saved = characterRepository.save(character);
        return ResponseEntity.ok(saved);
    }
}

