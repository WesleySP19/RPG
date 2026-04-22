package com.rpg.backend.controllers;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class MessageController {

    @MessageMapping("/session/{sessionId}/roll")
    @SendTo("/topic/session/{sessionId}")
    public Map<String, Object> handleRoll(@DestinationVariable String sessionId, Map<String, Object> message) {
        return message;
    }

    @MessageMapping("/session/{sessionId}/action")
    @SendTo("/topic/session/{sessionId}")
    public Map<String, Object> handleAction(@DestinationVariable String sessionId, Map<String, Object> message) {
        return message;
    }

    @MessageMapping("/session/{sessionId}/sync")
    @SendTo("/topic/session/{sessionId}")
    public Map<String, Object> handleSync(@DestinationVariable String sessionId, Map<String, Object> message) {
        return message;
    }
}
