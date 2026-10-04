"use client";

import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { 
  Bot, 
  User, 
  Send, 
  Copy, 
  Edit3, 
  ThumbsUp, 
  ThumbsDown, 
  Check, 
  Sparkles
} from "lucide-react";

type Message = {
  role: "user" | "model";
  content: string;
  id: string;
  liked?: boolean;
  disliked?: boolean;
};

export default function AssistantClient({ userName }: { userName: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "welcome-msg",
      role: "model", 
      content: `Hi ${userName}! I'm your Spendly AI Assistant. I can analyze your spending, give you financial advice, and help you stay on budget. What would you like to know?` 
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { 
      id: Date.now().toString(),
      role: "user", 
      content: input.trim() 
    };
    
    // We send only role and content to the API
    const apiMessages = [...messages, userMessage].map(({ role, content }) => ({ role, content }));
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) throw new Error("Failed to get response");
      
      const data = await res.json();
      setMessages((prev) => [...prev, { 
        id: (Date.now() + 1).toString(),
        role: "model", 
        content: data.reply 
      }]);
    } catch (error) {
      toast.error("Oops! I couldn't process that. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success("Copied to clipboard!", { position: "top-center" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEdit = (content: string) => {
    setInput(content);
  };

  const toggleFeedback = (id: string, type: "like" | "dislike") => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === id) {
        if (type === "like") {
          return { ...msg, liked: !msg.liked, disliked: false };
        } else {
          return { ...msg, disliked: !msg.disliked, liked: false };
        }
      }
      return msg;
    }));
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col bg-[#1E232F] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-5 border-b border-gray-800 bg-[#252A36] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#A3E635] to-[#86c924] flex items-center justify-center text-gray-900 shadow-lg shadow-[#A3E635]/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Spendly AI</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-xs font-medium text-gray-400">Online & ready to help</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            
            {/* Avatar */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
              m.role === "user" 
                ? "bg-gray-700 text-gray-300" 
                : "bg-[#2A3143] text-[#A3E635] border border-gray-700"
            }`}>
              {m.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            {/* Message Bubble & Actions */}
            <div className={`flex flex-col gap-2 max-w-[85%] sm:max-w-[75%] ${
              m.role === "user" ? "items-end" : "items-start"
            }`}>
              <div 
                className={`p-4 rounded-2xl group relative ${
                  m.role === "user" 
                    ? "bg-[#A3E635] text-gray-900 rounded-tr-sm shadow-sm" 
                    : "bg-[#252A36] border border-gray-800 text-gray-100 rounded-tl-sm shadow-sm"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                  {m.content}
                </p>
              </div>

              {/* Action Toolbar */}
              <div className={`flex items-center gap-1 mt-1 text-gray-500 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <button 
                  onClick={() => handleCopy(m.id, m.content)}
                  className="p-1.5 hover:bg-gray-800 hover:text-gray-300 rounded-md transition-colors tooltip"
                  title="Copy"
                >
                  {copiedId === m.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
                
                {m.role === "user" && (
                  <button 
                    onClick={() => handleEdit(m.content)}
                    className="p-1.5 hover:bg-gray-800 hover:text-gray-300 rounded-md transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}

                {m.role === "model" && (
                  <>
                    <button 
                      onClick={() => toggleFeedback(m.id, "like")}
                      className={`p-1.5 rounded-md transition-colors ${
                        m.liked ? "text-[#A3E635] bg-[#A3E635]/10" : "hover:bg-gray-800 hover:text-gray-300"
                      }`}
                      title="Like"
                    >
                      <ThumbsUp className={`w-4 h-4 ${m.liked ? "fill-current" : ""}`} />
                    </button>
                    <button 
                      onClick={() => toggleFeedback(m.id, "dislike")}
                      className={`p-1.5 rounded-md transition-colors ${
                        m.disliked ? "text-red-400 bg-red-400/10" : "hover:bg-gray-800 hover:text-gray-300"
                      }`}
                      title="Dislike"
                    >
                      <ThumbsDown className={`w-4 h-4 ${m.disliked ? "fill-current" : ""}`} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex gap-4 flex-row">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#2A3143] text-[#A3E635] border border-gray-700 flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-[#252A36] border border-gray-800 p-5 rounded-2xl rounded-tl-sm flex gap-2 items-center h-[52px]">
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-5 bg-[#252A36] border-t border-gray-800 mt-auto">
        <form onSubmit={handleSubmit} className="flex gap-3 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your finances, budgets, or spending habits..."
            className="flex-1 bg-[#1E232F] border border-gray-700 rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635] transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-[#A3E635] hover:bg-[#86c924] text-gray-900 w-14 rounded-2xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg shadow-[#A3E635]/20 shrink-0"
          >
            <Send className="w-6 h-6 ml-1" />
          </button>
        </form>
        <div className="text-center mt-3">
          <p className="text-xs text-gray-500">AI can make mistakes. Consider verifying important financial information.</p>
        </div>
      </div>
    </div>
  );
}
