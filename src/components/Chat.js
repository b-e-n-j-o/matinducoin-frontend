import React, { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// Fonction pour nettoyer et formater les messages système
const formatBotMessage = (message) => {
  if (!message) return '';

  try {
    // Si c'est une chaîne JSON, essayer de la parser
    if (typeof message === 'string') {
      try {
        const parsed = JSON.parse(message);
        return cleanMessageContent(parsed.content || parsed.message || message);
      } catch {
        // Si ce n'est pas du JSON valide, retourner la chaîne nettoyée
        return cleanMessageContent(message);
      }
    }

    // Si c'est déjà un objet
    if (typeof message === 'object') {
      return cleanMessageContent(message.content || message.message || JSON.stringify(message));
    }

    return cleanMessageContent(message.toString());
  } catch (e) {
    console.log('Erreur de parsing:', e);
    return '';
  }
};

const cleanMessageContent = (content) => {
  if (!content) return '';

  return content
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '')
    .replace(/\\"/g, '"')
    .replace(/\u001b\[[0-9;]*[a-zA-Z]/g, '')
    .replace(/^["']|["']$/g, '')
    .trim();
};

const isValidMessage = (message) => {
  if (!message) return false;

  // Liste minimale des patterns à filtrer
  const invalidPatterns = [
    'Erreur interne du chatbot',
    'SYSTEM:',
    'None',
    'undefined',
    '[object Object]'
  ];

  // Vérifie si le message contient un des patterns invalides
  const containsInvalidPattern = invalidPatterns.some(pattern => 
    message.toString().includes(pattern)
  );

  // Vérifie la longueur et la validité basique du message
  return !containsInvalidPattern && 
         message.toString().trim().length > 0 && 
         message.toString().length < 5000;
};

const TypingMessage = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, 15);

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return <div className="whitespace-pre-wrap">{displayedText}</div>;
};

const Chat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const ws = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    ws.current = new WebSocket('wss://matinducoin-backend-b2f47bd8118b.herokuapp.com');

    ws.current.onmessage = (event) => {
      try {
        console.log('Message reçu:', event.data); // Debug log

        let message = event.data;
        let formattedMessage;

        try {
          const parsed = JSON.parse(message);
          formattedMessage = formatBotMessage(parsed);
        } catch {
          formattedMessage = formatBotMessage(message);
        }

        console.log('Message formaté:', formattedMessage); // Debug log

        if (formattedMessage && isValidMessage(formattedMessage)) {
          setIsTyping(true);
          setMessages(prev => [...prev, {
            text: formattedMessage,
            sender: 'assistant',
            id: Date.now(),
            typing: true
          }]);
        } else {
          console.log('Message filtré:', formattedMessage); // Debug log
        }
      } catch (error) {
        console.error('Erreur de traitement du message:', error);
      }
    };

    ws.current.onerror = (error) => {
      console.error('Erreur WebSocket:', error);
      setMessages(prev => [...prev, {
        text: "Une erreur est survenue. Veuillez rafraîchir la page.",
        sender: 'assistant',
        id: Date.now()
      }]);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !ws.current) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    setMessages(prev => [...prev, {
      text: userMessage,
      sender: 'user',
      id: Date.now()
    }]);

    try {
      ws.current.send(JSON.stringify({
        type: 'message',
        content: userMessage
      }));
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 w-[350px] bg-white rounded-lg shadow-xl flex flex-col h-[600px]">
      <div className="p-4 bg-[#ff5900] text-[#ffd97f] flex justify-between items-center font-['Bobby_Jones_Soft',_sans-serif]">
        <h3 className="text-lg">Chat avec notre assistant</h3>
        <button 
          onClick={onClose} 
          className="hover:text-white transition-colors text-2xl"
          aria-label="Fermer le chat"
        >
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user' 
                  ? 'bg-[#ff5900] text-[#ffd97f]'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.typing ? (
                <TypingMessage 
                  text={message.text} 
                  onComplete={() => {
                    setIsTyping(false);
                    setMessages(prev => prev.map(msg => 
                      msg.id === message.id ? { ...msg, typing: false } : msg
                    ));
                  }}
                />
              ) : (
                <div className="whitespace-pre-wrap">
                  {message.text.split(/(\*\*.*?\*\*)/).map((part, index) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={index}>{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  })}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <Loader2 className="w-5 h-5 animate-spin text-[#ff5900]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question..."
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff5900]"
            disabled={isLoading || isTyping}
          />
          <button
            type="submit"
            className={`
              px-6 py-3 rounded-lg
              bg-[#ff5900] text-[#ffd97f]
              hover:bg-[#ffd97f] hover:text-[#ff5900]
              transition-colors
              disabled:opacity-50
              font-['Bobby_Jones_Soft',_sans-serif]
            `}
            disabled={isLoading || isTyping}
          >
            Envoyer
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;