import React, { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const OrderChat = ({ className = "" }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const messagesEndRef = useRef(null);
  const ws = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleNewMessage = (messageText) => {
    if (messageText) {
      setIsTyping(true);
      setMessages((prev) => [
        ...prev,
        {
          text: messageText,
          sender: 'assistant',
          id: Date.now(),
          typing: true,
        },
      ]);
    }
  };

  const waitForBotResponse = async () => {
    return new Promise((resolve) => {
      const messageHandler = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'response') {
            ws.current.removeEventListener('message', messageHandler);
            resolve(message.content);
          }
        } catch (error) {
          console.error('Erreur parsing message:', error);
        }
      };
      ws.current.addEventListener('message', messageHandler);
    });
  };

  const initializeOrderChat = async () => {
    if (isInitialized) return;

    try {
      while (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      ws.current.send(
        JSON.stringify({
          type: 'message',
          content: 'passer commande',
        })
      );

      await waitForBotResponse();

      ws.current.send(
        JSON.stringify({
          type: 'message',
          content: 'oui',
        })
      );

      await waitForBotResponse();
      setShowMessages(true);
      setIsInitialized(true);
    } catch (error) {
      console.error('Erreur initialisation:', error);
      setError("Erreur lors de l'initialisation du chat");
    }
  };

  useEffect(() => {
    ws.current = new WebSocket('wss://matinducoin-backend-b2f47bd8118b.herokuapp.com');

    ws.current.onopen = () => {
      initializeOrderChat();
    };

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'response') {
          handleNewMessage(message.content);
        }
      } catch (error) {
        console.error('Erreur traitement message:', error);
      }
    };

    ws.current.onclose = () => {
      console.log("🔌 WebSocket fermé");
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (isInitialized) {
      const timer = setTimeout(() => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cart.length > 0) {
          const cartMessage = cart
            .map((item) => `${item.quantity} x ${item.name}`)
            .join(', ');

          setMessages((prev) => [
            ...prev,
            { text: cartMessage, sender: 'user', id: Date.now() },
          ]);

          ws.current.send(
            JSON.stringify({
              type: 'message',
              content: cartMessage,
            })
          );
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isInitialized]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      setMessages((prev) => [
        ...prev,
        { text: userMessage, sender: 'user', id: Date.now() },
      ]);

      ws.current.send(
        JSON.stringify({
          type: 'message',
          content: userMessage,
        })
      );
    } catch (error) {
      setError("Erreur d'envoi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg flex flex-col ${className}`}>
      <div className="p-4 bg-[#ff5900] text-[#ffd97f] font-['Bobby_Jones_Soft',_sans-serif] rounded-t-xl">
        <h3 className="text-lg">Passez votre commande</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[500px]">
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
                <div className="whitespace-pre-wrap">{message.text}</div>
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

      <form onSubmit={handleSubmit} className="p-4 border-t mt-auto">
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Que souhaitez-vous commander ?"
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff5900]"
              disabled={isLoading || isTyping || !isInitialized}
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-[#ff5900] text-[#ffd97f] hover:bg-[#ff7a33] transition-colors disabled:opacity-50 font-['Bobby_Jones_Soft',_sans-serif]"
              disabled={isLoading || isTyping || !isInitialized}
            >
              Envoyer
            </button>
          </div>
          {error && (
            <div className="text-red-500 text-sm mt-1">
              {error}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default OrderChat;