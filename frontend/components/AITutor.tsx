import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send, X, Zap, MessageSquare } from './Icons';
import { ChatMessage } from '../types';

interface AITutorProps {
  context: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AITutor: React.FC<AITutorProps> = ({ context, isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Hi! I am your AI Tutor. I see you are learning about this topic. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update initial message when context changes
  useEffect(() => {
    if (context) {
       setMessages([
        { id: Date.now().toString(), role: 'model', text: `I'm ready to help you with: **${context}**. What's your question?` }
      ]);
    }
  }, [context]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });
      
      const history = messages.map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: input }] }
        ],
        config: {
          systemInstruction: `You are an expert software engineering tutor for Nexus Academy. The user is currently viewing a lesson about: "${context}". Be concise, helpful, and provide code examples if relevant. Use markdown for formatting.`,
        }
      });

      let fullResponse = '';
      const responseId = (Date.now() + 1).toString();
      
      setMessages(prev => [...prev, { id: responseId, role: 'model', text: '' }]);

      for await (const chunk of responseStream) {
        fullResponse += chunk.text;
        setMessages(prev => prev.map(msg => 
          msg.id === responseId ? { ...msg, text: fullResponse } : msg
        ));
      }

    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: 'Sorry, I encountered an error connecting to the AI service.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-ui-surface border-l border-ui-border shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="p-4 border-b border-ui-border flex justify-between items-center bg-ui-bg/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-brand-600">
          <Zap size={20} className="animate-pulse" />
          <h3 className="font-semibold">Nexus AI Tutor</h3>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-ui-surface">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
              msg.role === 'user' 
                ? 'bg-brand-600 text-white rounded-tr-sm' 
                : 'bg-gray-100 text-gray-800 rounded-tl-sm border border-gray-200'
            }`}>
              {msg.text.split('\n').map((line, i) => (
                <p key={i} className="mb-1 last:mb-0">
                  {line.includes('`') ? (
                    <span dangerouslySetInnerHTML={{
                      __html: line.replace(/`([^`]+)`/g, '<code class="bg-black/10 px-1 rounded font-mono text-xs">$1</code>')
                    }} />
                  ) : line}
                </p>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 border border-gray-200 text-gray-500 rounded-2xl rounded-tl-sm p-3 text-sm flex gap-1 shadow-sm">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-ui-border bg-ui-bg/80">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about this lesson..."
            className="w-full bg-ui-surface border border-ui-border rounded-full py-3 pl-4 pr-12 text-sm text-gray-900 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-sm"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-600 rounded-full text-white hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
