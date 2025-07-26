package APIThink41.example.Naveendemo.dto;



public class ChatRequest {
    private String userMessage;
    private Long conversationId;
    private Long userId;

    // Getters and setters
    public String getUserMessage() { return userMessage; }
    public void setUserMessage(String userMessage) { this.userMessage = userMessage; }

    public Long getConversationId() { return conversationId; }
    public void setConversationId(Long conversationId) { this.conversationId = conversationId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
