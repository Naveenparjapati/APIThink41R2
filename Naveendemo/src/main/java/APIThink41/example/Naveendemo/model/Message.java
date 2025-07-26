package APIThink41.example.Naveendemo.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String role; // "user" or "assistant"
    private String content;

    @ManyToOne
    private Conversation conversation;

    private LocalDateTime timestamp = LocalDateTime.now();
}
