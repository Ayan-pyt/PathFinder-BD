import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import apiClient from '../../services/api/client';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

const suggestedQuestions = [
  "How much bank balance for Canada visa?",
  "IELTS requirement for Germany?",
  "Documents needed for UK visa?",
  "Part-time work rules in Australia?"
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello! I'm your visa assistant. Ask me anything about student visas for Bangladeshi students! 🇧🇩", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (question?: string) => {
    const messageToSend = question || input;
    if (!messageToSend.trim()) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), text: messageToSend, isUser: true }]);
    setInput('');
    setIsLoading(true);

    try {
      const { data } = await apiClient.post('/chatbot/visa', {
        question: messageToSend,
        countryName: 'general'
      });
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: data.data?.answer || "Sorry, I couldn't process that.",
        isUser: false
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "Sorry, something went wrong. Please try again.",
        isUser: false
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot size={18} className="text-white" />
          <span className="text-white font-semibold text-sm">Visa Assistant</span>
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition cursor-pointer">
          <X size={16} />
        </button>
      </div>

      <div className="h-80 overflow-y-auto p-4 bg-slate-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-3 flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
              msg.isUser
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none'
                : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-2 bg-slate-100 border-t border-slate-200">
        <p className="text-[10px] text-slate-400 mb-2">Suggested questions (click to ask):</p>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded-full text-slate-600 hover:border-purple-300 hover:text-purple-600 transition cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-slate-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a visa question..."
            className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-400"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center disabled:opacity-50 transition cursor-pointer"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}


// import { useState, useRef, useEffect } from 'react';
// import { MessageCircle, X, Send, Bot } from 'lucide-react';

// interface Message {
//   id: string;
//   text: string;
//   isUser: boolean;
// }

// const suggestedQuestions = [
//   "How much bank balance for Canada visa?",
//   "IELTS requirement for Germany?",
//   "Documents needed for UK visa?",
//   "Part-time work rules in Australia?"
// ];

// export default function ChatbotWidget() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([
//     { id: '1', text: "Hello! I'm your visa assistant. Ask me anything about student visas for Bangladeshi students! 🇧🇩", isUser: false }
//   ]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleSend = async (question?: string) => {
//     const messageToSend = question || input;
//     if (!messageToSend.trim()) return;

//     setMessages(prev => [...prev, { id: Date.now().toString(), text: messageToSend, isUser: true }]);
//     setInput('');
//     setIsLoading(true);

//     try {
//       const response = await fetch('/api/chatbot/visa', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ question: messageToSend, countryName: 'general' })
//       });
//       const data = await response.json();
//       setMessages(prev => [...prev, { 
//         id: (Date.now() + 1).toString(), 
//         text: data.data?.answer || "Sorry, I couldn't process that.", 
//         isUser: false 
//       }]);
//     } catch (error) {
//       setMessages(prev => [...prev, { 
//         id: (Date.now() + 1).toString(), 
//         text: "Connection error. Backend running on port 5000?", 
//         isUser: false 
//       }]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!isOpen) {
//     return (
//       <button
//         onClick={() => setIsOpen(true)}
//         className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer"
//       >
//         <MessageCircle size={24} />
//       </button>
//     );
//   }

//   return (
//     <div className="fixed bottom-6 right-6 z-50 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 flex justify-between items-center">
//         <div className="flex items-center gap-2">
//           <Bot size={18} className="text-white" />
//           <span className="text-white font-semibold text-sm">Visa Assistant</span>
//           <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
//         </div>
//         <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition cursor-pointer">
//           <X size={16} />
//         </button>
//       </div>

//       {/* Messages */}
//       <div className="h-80 overflow-y-auto p-4 bg-slate-50">
//         {messages.map((msg) => (
//           <div key={msg.id} className={`mb-3 flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
//             <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
//               msg.isUser
//                 ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none'
//                 : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
//             }`}>
//               {msg.text}
//             </div>
//           </div>
//         ))}
//         {isLoading && (
//           <div className="flex justify-start">
//             <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl">
//               <div className="flex gap-1">
//                 <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
//                 <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
//                 <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
//               </div>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Suggested Questions */}
//       <div className="px-4 py-2 bg-slate-100 border-t border-slate-200">
//         <p className="text-[10px] text-slate-400 mb-2">Suggested questions:</p>
//         <div className="flex flex-wrap gap-2">
//           {suggestedQuestions.map((q, i) => (
//             <button
//               key={i}
//               onClick={() => handleSend(q)}
//               className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded-full text-slate-600 hover:border-purple-300 hover:text-purple-600 transition cursor-pointer"
//             >
//               {q}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Input */}
//       <div className="p-3 border-t border-slate-200 bg-white">
//         <div className="flex gap-2">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyPress={(e) => e.key === 'Enter' && handleSend()}
//             placeholder="Ask a visa question..."
//             className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-400"
//           />
//           <button
//             onClick={() => handleSend()}
//             disabled={!input.trim() || isLoading}
//             className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center disabled:opacity-50 transition cursor-pointer"
//           >
//             <Send size={16} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }