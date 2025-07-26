package APIThink41.example.Naveendemo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import APIThink41.example.Naveendemo.model.Conversation;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {}
