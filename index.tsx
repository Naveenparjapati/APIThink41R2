/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {GoogleGenAI, Chat} from '@google/genai';
import {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  useMemo,
  FormEvent,
  ChangeEvent,
  ReactNode,
} from 'react';
import ReactDOM from 'react-dom/client';

// --- Types ---
type Message = {
  role: 'user' | 'model';
  text: string;
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
};

type ChatContextType = {
  conversations: Conversation[];
  activeConversationId: string | null;
  sendMessage: (message: string) => Promise<void>;
  selectConversation: (id: string) => void;
  startNewConversation: () => void;
  isLoading: boolean;
  userInput: string;
  setUserInput: (input: string) => void;
};

// --- Context and Provider ---

const ChatContext = createContext<ChatContextType | null>(null);

// Use import.meta.env.VITE_API_KEY for the API key in a Vite project
const ai = new GoogleGenAI({apiKey: import.meta.env.VITE_API_KEY});

function ChatProvider({children}: {children: ReactNode}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const chatInstances = useRef<Map<string, Chat>>(new Map());

  // Load initial conversation on mount
  useEffect(() => {
    if (conversations.length === 0) {
      startNewConversation();
    }
  }, []);

  const startNewConversation = () => {
    const newId = `conv-${Date.now()}`;
    const newConversation: Conversation = {
      id: newId,
      title: 'New Chat',
      messages: [],
    };
    setConversations((prev) => [...prev, newConversation]);
    setActiveConversationId(newId);
    setUserInput('');
  };

  const selectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  const sendMessage = async (messageText: string) => {
    if (!activeConversationId) return;

    const userMessage: Message = {role: 'user', text: messageText};
    setIsLoading(true);

    // Update state with user message and an empty model message
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversationId) {
          // Set title from first message
          const newTitle =
            conv.messages.length === 0
              ? messageText.substring(0, 40) +
                (messageText.length > 40 ? '...' : '')
              : conv.title;
          return {
            ...conv,
            title: newTitle,
            messages: [
              ...conv.messages,
              userMessage,
              {role: 'model', text: ''},
            ],
          };
        }
        return conv;
      })
    );
    setUserInput('');

    try {
      if (!chatInstances.current.has(activeConversationId)) {
        const activeConv = conversations.find(
          (c) => c.id === activeConversationId
        );
        const history = activeConv?.messages
          .slice(0, -2) // History before the latest user message
          .map((msg) => ({
            role: msg.role,
            parts: [{text: msg.text}],
          }));

        const chat = ai.chats.create({
          model: 'gemini-2.5-flash',
          history: history,
        });
        chatInstances.current.set(activeConversationId, chat);
      }

      const chat = chatInstances.current.get(activeConversationId)!;
      const result = await chat.sendMessageStream({message: messageText});

      for await (const chunk of result) {
        const chunkText = chunk.text;
        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id === activeConversationId) {
              const lastMessage = conv.messages[conv.messages.length - 1];
              lastMessage.text += chunkText;
              return {...conv, messages: [...conv.messages]};
            }
            return conv;
          })
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === activeConversationId) {
            const lastMessage = conv.messages[conv.messages.length - 1];
            lastMessage.text =
              'Sorry, something went wrong. Please try again.';
            return {...conv, messages: [...conv.messages]};
          }
          return conv;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = useMemo(
    () => ({
      conversations,
      activeConversationId,
      sendMessage,
      selectConversation,
      startNewConversation,
      isLoading,
      userInput,
      setUserInput,
    }),
    [conversations, activeConversationId, isLoading, userInput]
  );

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
}

const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// --- Components ---

function Message({message}: {message: Message}) {
  return (
    <div className={`message ${message.role}`}>
      <div className="message-content">
        <p>{message.text}</p>
      </div>
    </div>
  );
}

function MessageList() {
  const {conversations, activeConversationId, isLoading} = useChat();
  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [activeConversation?.messages, isLoading]);

  return (
    <div className="message-list">
      {activeConversation?.messages.map((msg, index) => (
        <Message key={index} message={msg} />
      ))}
      {isLoading &&
        activeConversation?.messages[activeConversation.messages.length - 1]
          ?.role === 'model' && (
          <div className="message model">
            <div className="message-content">
              <div className="loading-spinner"></div>
            </div>
          </div>
        )}
      <div ref={messagesEndRef} />
    </div>
  );
}

function UserInput() {
  const {sendMessage, isLoading, userInput, setUserInput} = useChat();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (userInput.trim() && !isLoading) {
      sendMessage(userInput);
    }
  };

  return (
    <form className="user-input" onSubmit={handleSubmit}>
      <input
        type="text"
        aria-label="Chat input"
        placeholder="Type your message..."
        value={userInput}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setUserInput(e.target.value)
        }
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading} aria-label="Send message">
        Send
      </button>
    </form>
  );
}

function ConversationHistory() {
  const {
    conversations,
    activeConversationId,
    selectConversation,
    startNewConversation,
  } = useChat();

  return (
    <aside className="conversation-history">
      <button className="new-chat-btn" onClick={startNewConversation}>
        + New Chat
      </button>
      <nav>
        <ul>
          {conversations
            .slice()
            .reverse()
            .map((conv) => (
              <li
                key={conv.id}
                className={conv.id === activeConversationId ? 'active' : ''}
                onClick={() => selectConversation(conv.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && selectConversation(conv.id)}
                aria-current={conv.id === activeConversationId}
              >
                {conv.title || 'New Chat'}
              </li>
            ))}
        </ul>
      </nav>
    </aside>
  );
}

function ChatWindow() {
  const {activeConversationId} = useChat();
  return (
    <main className="chat-window">
      <ConversationHistory />
      <section className="chat-area">
        {activeConversationId ? (
          <>
            <MessageList />
            <UserInput />
          </>
        ) : (
          <div className="no-chat-selected">
            <h1>Gemini Chat</h1>
            <p>Select a conversation or start a new one.</p>
          </div>
        )}
      </section>
    </main>
  );
}

function App() {
  return (
    <ChatProvider>
      <ChatWindow />
    </ChatProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);