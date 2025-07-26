package APIThink41.example.Naveendemo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Order {
    @Id
    private String orderId;
    private String userEmail;
    private String status;
}
