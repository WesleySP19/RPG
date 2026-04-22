package com.rpg.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserResponseDTO {
    private String id;
    private String identifier;
    private String userTag;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
}
