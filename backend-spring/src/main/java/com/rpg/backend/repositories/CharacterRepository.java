package com.rpg.backend.repositories;

import com.rpg.backend.models.CharacterEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CharacterRepository extends JpaRepository<CharacterEntity, String> {
    List<CharacterEntity> findByPlayerId(String playerId);
}

