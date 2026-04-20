package com.rpg.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {

    @Id
    @Column(name = "player_id", nullable = false, unique = true)
    private String id; // UUID

    @Column(name = "identifier", nullable = false, unique = true)
    private String identifier; // Email ou celular

    @Column(name = "user_tag", nullable = false)
    private String userTag; 

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.lastLogin = LocalDateTime.now();
    }
}

