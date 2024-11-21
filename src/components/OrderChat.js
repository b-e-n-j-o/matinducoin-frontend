import React, { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const TypingMessage = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 15);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return <div className="whitespace-pre-wrap">{displayedText}</div>;
};

const OrderChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef(null);
  const ws = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Fonction pour simuler l'envoi d'un message utilisateur
  const simulateUserMessage = async (content) => {
    return new Promise(resolve => {
      setMessages(prev => [...prev, {
        text: content,
        sender: 'user',
        id: Date.now()
      }]);
      resolve();
    });
  };

  // Fonction pour attendre une réponse du bot
  const waitForBotResponse = async () => {
    return new Promise(resolve => {
      const checkResponse = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message && message.text) {
            ws.current.removeEventListener('message', checkResponse);
            resolve(message.text);
          }
        } catch (error) {
          console.error('Erreur:', error);
        }
      };
      
      ws.current.addEventListener('message', checkResponse);
    });
  };

  // Initialisation du chat avec simulation des premières étapes
  const initializeOrderChat = async () => {
    if (isInitialized) return;

    // Attendre que la connexion WebSocket soit établie
    while (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Simuler les messages initiaux de manière invisible
    await simulateUserMessage("passer commande");
    await waitForBotResponse(); // Attendre la réponse de classification
    
    await simulateUserMessage("oui");
    await waitForBotResponse(); // Attendre la confirmation

    // Afficher uniquement le message de bienvenue pour les commandes
    setMessages([{
      text: "Bonjour ! Je suis là pour prendre votre commande. Voici nos produits disponibles :\n\n- Reveil Soleil (2.99$) : Shot énergisant au gingembre\n- Matcha Matin (3.49$) : Shot au matcha et gingembre\n- Berry Balance (3.49$) : Shot aux baies et gingembre\n\nQue souhaitez-vous commander ?",
      sender: 'assistant',
      id: Date.now(),
      typing: true
    }]);

    setIsInitialized(true);
  };

  useEffect(() => {
    // Initialiser WebSocket
    ws.current = new WebSocket('wss://matinducoin-backend-b2f47bd8118b.herokuapp.com');

    ws.current.onopen = () => {
      // Démarrer l'initialisation une fois la connexion établie
      initializeOrderChat();
    };

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message && message.text && isInitialized) {
          setIsTyping(true);
          setMessages(prev => [...prev, {
            text: message.text,
            sender: 'assistant',
            id: Date.now(),
            typing: true
          }]);
        }
      } catch (error) {
        console.error('Erreur:', error);
        setError("Une erreur est survenue");
      }
    };

    ws.current.onerror = () => {
      setError("Erreur de connexion");
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setInput('');
    setIsLoading(true);

    try {
      setMessages(prev => [...prev, {
        text: input.trim(),
        sender: 'user',
        id: Date.now()
      }]);

      ws.current.send(JSON.stringify({
        type: 'message',
        content: input.trim()
      }));
    } catch (error) {
      setError("Erreur d'envoi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-[350px] bg-white rounded-lg shadow-xl flex flex-col h-[600px]">
      <div className="p-4 bg-[#ff5900] text-[#ffd97f] flex justify-between items-center font-['Bobby_Jones_Soft',_sans-serif]">
        <h3 className="text-lg">Passez votre commande</h3>
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

      <form onSubmit={handleSubmit} className="p-4 border-t">
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
              className="px-6 py-3 rounded-lg bg-[#ff5900] text-[#ffd97f] hover:bg-[#ffd97f] hover:text-[#ff5900] transition-colors disabled:opacity-50 font-['Bobby_Jones_Soft',_sans-serif]"
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