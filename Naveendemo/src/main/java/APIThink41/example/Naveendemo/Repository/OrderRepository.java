package APIThink41.example.Naveendemo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import APIThink41.example.Naveendemo.model.Order;

public interface OrderRepository extends JpaRepository<Order, String> {}