import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    type: 'bot',
    content: "Hello! I'm your AI assistant for this ebook. I can help answer questions about web development, React, Tailwind CSS, and any topics covered in the chapters. What would you like to know?",
    timestamp: new Date()
  }
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateBotResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('react') || input.includes('component')) {
      return "React is a powerful library for building user interfaces! In Chapter 2, we cover components, JSX, props, state, and hooks. Components are reusable pieces of UI that can accept props (data) and manage their own state. Would you like me to explain any specific React concept in more detail?";
    }
    
    if (input.includes('tailwind') || input.includes('css') || input.includes('styling')) {
      return "Tailwind CSS is covered extensively in Chapter 3! It's a utility-first framework that lets you build designs rapidly using pre-built classes. Instead of writing custom CSS, you apply utility classes directly to your HTML elements. This approach leads to more consistent designs and faster development. Are you interested in learning about specific Tailwind features?";
    }
    
    if (input.includes('web development') || input.includes('html') || input.includes('javascript')) {
      return "Web development fundamentals are introduced in Chapter 1. We cover HTML5 for structure, CSS3 for styling, and modern JavaScript (ES6+) for interactivity. These three technologies form the foundation of all web development. The key is understanding how they work together to create engaging user experiences. What specific aspect would you like to explore?";
    }
    
    if (input.includes('chapter') || input.includes('navigation')) {
      return "You can navigate between chapters using the table of contents on the left sidebar (or the menu button on mobile), or use the Previous/Next buttons at the top and bottom of each chapter. Each chapter builds upon the previous one, so I recommend reading them in order if you're new to web development.";
    }
    
    return "That's a great question! This ebook covers modern web development from fundamentals to advanced topics. Feel free to ask me about any concept from the chapters - React components, Tailwind utilities, JavaScript features, or general web development practices. I'm here to help clarify anything that might be confusing!";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed ${isMobile ? 'bottom-4 right-4' : 'bottom-6 right-6'} z-50 h-14 w-14 rounded-full shadow-lg`}
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className={`fixed z-50 ${
      isMobile 
        ? 'inset-4 max-h-[80vh]' 
        : 'bottom-6 right-6 w-96 h-[32rem]'
    }`}>
      <div className={`bg-card border rounded-xl shadow-2xl flex flex-col h-full ${
        isOpen ? 'chat-slide-in' : ''
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-secondary/50 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <MessageCircle className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Assistant</h3>
              <p className="text-xs text-muted-foreground">Ask me anything about the ebook</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        message.type === 'user'
                          ? 'chat-bubble-user'
                          : 'chat-bubble-bot'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="chat-bubble-bot p-3 rounded-lg text-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-150"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about the ebook content..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}