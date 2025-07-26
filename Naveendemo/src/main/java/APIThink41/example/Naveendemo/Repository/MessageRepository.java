package APIThink41.example.Naveendemo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import APIThink41.example.Naveendemo.model.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {} 