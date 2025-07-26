package APIThink41.example.Naveendemo.dto;


public class ChatResponse {
    private Long conversationId;
    private String userMessage;
    private String aiResponse;

    public ChatResponse(Long conversationId, String userMessage, String aiResponse) {
        this.conversationId = conversationId;
        this.userMessage = userMessage;
        this.aiResponse = aiResponse;
    }

    // Getters and setters
    public Long getConversationId() { return conversationId; }
    public void setConversationId(Long conversationId) { this.conversationId = conversationId; }

    public String getUserMessage() { return userMessage; }
    public void setUserMessage(String userMessage) { this.userMessage = userMessage; }

    public String getAiResponse() { return aiResponse; }
    public void setAiResponse(String aiResponse) { this.aiResponse = aiResponse; }
}
