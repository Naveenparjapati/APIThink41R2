package APIThink41.example.Naveendemo.Service;




import org.springframework.stereotype.Component;

@Component
public class LlmClient {

    public String getResponse(String userInput) {
        if (userInput.toLowerCase().contains("order")) {
            return "I can help with that. Please provide your Order ID or the email address associated with the purchase.";
        }
        // Mock response for now
        return "This is a mock AI response to: " + userInput;
    }
}
