package com.rpg.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class SessionEntity {
    @Id
    private String id;
    private String masterId;
    
    @ElementCollection
    private List<String> logs = new ArrayList<>();
    
    @ElementCollection
    private List<String> players = new ArrayList<>();
}

