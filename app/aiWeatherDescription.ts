// General Purpose AI Chatbot Service using OpenAI GPT
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

interface ChatResponse {
  message: string;
  isLoading: boolean;
  error?: string;
}

interface ChatbotConfig {
  model?: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo-preview';
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

// Main chatbot class
export class AIChatbot {
  private apiKey: string;
  private config: ChatbotConfig;
  private conversationHistory: ChatMessage[] = [];

  constructor(apiKey?: string, config?: ChatbotConfig) {
    this.apiKey = apiKey || OPENAI_API_KEY || '';
    this.config = {
      model: 'gpt-3.5-turbo',
      maxTokens: 1000,
      temperature: 0.7,
      systemPrompt: 'You are a helpful, knowledgeable, and friendly AI assistant. You can answer questions on any topic, help with tasks, provide explanations, give advice, and engage in conversations. Always be accurate, helpful, and conversational in your responses.',
      ...config
    };

    // Initialize with system prompt
    if (this.config.systemPrompt) {
      this.conversationHistory.push({
        role: 'system',
        content: this.config.systemPrompt,
        timestamp: new Date()
      });
    }
  }

  // Main method to send a message and get AI response
  async sendMessage(userMessage: string): Promise<ChatResponse> {
    if (!this.apiKey) {
      return {
        message: "I'm sorry, but the AI service is not properly configured. Please check your API key.",
        isLoading: false,
        error: "Missing API key"
      };
    }

    // Add user message to conversation history
    this.addMessage('user', userMessage);

    try {
      const response = await this.callOpenAI();
      
      if (response) {
        // Add AI response to conversation history
        this.addMessage('assistant', response);
        
        return {
          message: response,
          isLoading: false
        };
      } else {
        return {
          message: "I'm sorry, I couldn't process your request right now. Please try again.",
          isLoading: false,
          error: "No response from AI service"
        };
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      return {
        message: "I'm experiencing some technical difficulties. Please try again in a moment.",
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Call OpenAI API
  private async callOpenAI(): Promise<string | null> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: this.conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
          presence_penalty: 0.6,
          frequency_penalty: 0.1
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const result = await response.json();
      
      if (result.choices && result.choices[0] && result.choices[0].message) {
        return result.choices[0].message.content.trim();
      }
      
      return null;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }

  // Add message to conversation history
  private addMessage(role: 'user' | 'assistant', content: string): void {
    this.conversationHistory.push({
      role,
      content,
      timestamp: new Date()
    });

    // Keep conversation history manageable (last 20 messages + system prompt)
    const systemMessages = this.conversationHistory.filter(msg => msg.role === 'system');
    const nonSystemMessages = this.conversationHistory.filter(msg => msg.role !== 'system').slice(-20);
    this.conversationHistory = [...systemMessages, ...nonSystemMessages];
  }

  // Get conversation history
  getConversationHistory(): ChatMessage[] {
    return this.conversationHistory.filter(msg => msg.role !== 'system');
  }

  // Clear conversation history (keep system prompt)
  clearHistory(): void {
    const systemMessages = this.conversationHistory.filter(msg => msg.role === 'system');
    this.conversationHistory = systemMessages;
  }

  // Update system prompt and reset conversation
  setSystemPrompt(prompt: string): void {
    this.config.systemPrompt = prompt;
    this.conversationHistory = [{
      role: 'system',
      content: prompt,
      timestamp: new Date()
    }];
  }

  // Update configuration
  updateConfig(newConfig: Partial<ChatbotConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Convenience function for simple one-off questions
export async function askAI(question: string, config?: ChatbotConfig): Promise<ChatResponse> {
  const chatbot = new AIChatbot(OPENAI_API_KEY, config);
  return await chatbot.sendMessage(question);
}

// React hook for using the chatbot in React components
export function useChatbot(config?: ChatbotConfig) {
  const [chatbot] = React.useState(() => new AIChatbot(OPENAI_API_KEY, config));
  const [isLoading, setIsLoading] = React.useState(false);

  const sendMessage = async (message: string): Promise<ChatResponse> => {
    setIsLoading(true);
    try {
      const response = await chatbot.sendMessage(message);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading,
    getHistory: () => chatbot.getConversationHistory(),
    clearHistory: () => chatbot.clearHistory(),
    setSystemPrompt: (prompt: string) => chatbot.setSystemPrompt(prompt),
    updateConfig: (newConfig: Partial<ChatbotConfig>) => chatbot.updateConfig(newConfig)
  };
}

// Example usage functions
export const ChatbotExamples = {
  // General conversation
  async generalChat(message: string): Promise<ChatResponse> {
    return askAI(message);
  },

  // Code help
  async codeAssistant(codeQuestion: string): Promise<ChatResponse> {
    return askAI(codeQuestion, {
      systemPrompt: 'You are an expert programming assistant. Help with coding questions, debug issues, explain concepts, and provide code examples. Be precise and practical in your responses.',
      temperature: 0.3
    });
  },

  // Creative writing
  async creativeWriting(prompt: string): Promise<ChatResponse> {
    return askAI(prompt, {
      systemPrompt: 'You are a creative writing assistant. Help with storytelling, character development, plot ideas, and creative content. Be imaginative and inspiring.',
      temperature: 0.9
    });
  },

  // Educational tutor
  async tutor(question: string): Promise<ChatResponse> {
    return askAI(question, {
      systemPrompt: 'You are a patient and knowledgeable tutor. Explain concepts clearly, provide examples, and help students learn. Break down complex topics into understandable parts.',
      temperature: 0.4
    });
  },

  // Business advisor
  async businessAdvice(question: string): Promise<ChatResponse> {
    return askAI(question, {
      systemPrompt: 'You are a business consultant and advisor. Provide practical business advice, strategic insights, and professional guidance. Be analytical and solution-focused.',
      temperature: 0.5
    });
  }
};

// Export default instance
export default new AIChatbot();