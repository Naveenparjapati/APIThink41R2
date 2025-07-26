package APIThink41.example.Naveendemo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import APIThink41.example.Naveendemo.model.User;

public interface UserRepository extends JpaRepository<User, Long> {} 