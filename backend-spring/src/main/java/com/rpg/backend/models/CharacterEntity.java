package com.rpg.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "characters")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CharacterEntity {

    @Id
    private String id; // char_timestamp

    @Column(name = "player_id", nullable = false)
    private String playerId; // UUID foreign key conceitual

    private String name;
    private String rpgClass; // class is a reserved word
    private Integer level;
    private Integer xp;
    
    private Integer hpMax;
    private Integer hpCurrent;
    private Integer ac;

    @Column(columnDefinition = "TEXT")
    private String attributesJson; // Armazena força, destreza, etc json

    @Column(columnDefinition = "TEXT")
    private String equipmentJson; // json array
}

