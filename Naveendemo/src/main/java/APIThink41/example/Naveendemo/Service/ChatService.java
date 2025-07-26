package APIThink41.example.Naveendemo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import APIThink41.example.Naveendemo.Repository.ConversationRepository;
import APIThink41.example.Naveendemo.Repository.MessageRepository;
import APIThink41.example.Naveendemo.Repository.OrderRepository;
import APIThink41.example.Naveendemo.Repository.UserRepository;
import APIThink41.example.Naveendemo.dto.ChatRequest;
import APIThink41.example.Naveendemo.dto.ChatResponse;
import APIThink41.example.Naveendemo.model.Conversation;
import APIThink41.example.Naveendemo.model.Message;
import APIThink41.example.Naveendemo.model.User;

@Service
public class ChatService {

    @Autowired private ConversationRepository conversationRepo;
    @Autowired private MessageRepository messageRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private OrderRepository orderRepo;
    @Autowired private LlmClient llmClient;

    public ChatResponse handleMessage(ChatRequest request) {
        User user = userRepo.findById(request.getUserId()).orElseThrow();
        Conversation conversation;

        if (request.getConversationId() == null) {
            conversation = new Conversation();
            conversation.setUser(user);
            conversation = conversationRepo.save(conversation);
        } else {
            conversation = conversationRepo.findById(request.getConversationId()).orElseThrow();
        }

        // Save user's message
        Message userMsg = new Message();
        userMsg.setRole("user");
        userMsg.setContent(request.getUserMessage());
        userMsg.setConversation(conversation);
        messageRepo.save(userMsg);

        // Get response from LLM
        String aiReply = llmClient.getResponse(request.getUserMessage());

        // Save AI's message
        Message aiMsg = new Message();
        aiMsg.setRole("assistant");
        aiMsg.setContent(aiReply);
        aiMsg.setConversation(conversation);
        messageRepo.save(aiMsg);

        return new ChatResponse(conversation.getId(), request.getUserMessage(), aiReply);
    }
}
