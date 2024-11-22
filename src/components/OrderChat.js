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
  const messageCount = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleNewMessage = (messageText) => {
    if (messageText) {
      console.log(`📨 Traitement nouveau message: "${messageText}"`);
      messageCount.current += 1;
      console.log(`Message count: ${messageCount.current}`);

      setIsTyping(true);
      setMessages(prev => [...prev, {
        text: messageText,
        sender: 'assistant',
        id: Date.now(),
        typing: true
      }]);
      console.log('✅ Message ajouté au chat');
    }
  };

  const waitForBotResponse = async () => {
    console.log('⏳ Attente réponse bot...');
    return new Promise((resolve) => {
      let messageHandler = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log("🤖 Réponse bot reçue:", message);
          
          if (message && (message.content || message.text)) {
            ws.current.removeEventListener('message', messageHandler);
            const response = message.content || message.text;
            console.log(`✅ Réponse valide: "${response}"`);
            resolve(response);
          }
        } catch (error) {
          console.error('❌ Erreur parsing réponse:', error);
        }
      };
      ws.current.addEventListener('message', messageHandler);
    });
  };

  const initializeOrderChat = async () => {
    if (isInitialized) {
      console.log("ℹ️ Chat déjà initialisé");
      return;
    }

    try {
      console.log("🚀 Début initialisation chat");
      
      while (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
        console.log("⏳ Attente connexion WebSocket...");
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log("1️⃣ Envoi commande initiale");
      ws.current.send(JSON.stringify({
        type: 'message',
        content: 'passer commande'
      }));
      const firstResponse = await waitForBotResponse();
      console.log("Première réponse:", firstResponse);

      console.log("2️⃣ Envoi confirmation");
      ws.current.send(JSON.stringify({
        type: 'message',
        content: 'oui'
      }));
      const secondResponse = await waitForBotResponse();
      console.log("Deuxième réponse:", secondResponse);

      console.log("🎯 Activation affichage messages");
      setShowMessages(true);
      setIsInitialized(true);

    } catch (error) {
      console.error("❌ Erreur initialisation:", error);
      setError("Erreur lors de l'initialisation du chat");
    }
  };

  useEffect(() => {
    ws.current = new WebSocket('wss://matinducoin-backend-b2f47bd8118b.herokuapp.com');

    ws.current.onopen = () => {
      console.log("🔌 WebSocket connecté");
      initializeOrderChat();
    };

    ws.current.onmessage = (event) => {
      try {
        console.log("\n=== Nouveau message reçu ===");
        console.log("Message brut:", event.data);
        const message = JSON.parse(event.data);
        console.log("Message parsé:", message);

        let messageText = null;
        if (typeof message === 'object') {
          if (message.text || message.content || message.response) {
            messageText = message.text || message.content || message.response;
            console.log("Message format standard:", messageText);
          }
          else if (message.INFO && typeof message.INFO === 'string') {
            const infoMatch = message.INFO.match(/Réponse générée: (.*?)(?=\n|$)/);
            if (infoMatch) {
              messageText = infoMatch[1].trim();
              console.log("Message format log:", messageText);
            }
          }
        }

        console.log("États actuels:");
        console.log("- showMessages:", showMessages);
        console.log("- isInitialized:", isInitialized);
        console.log("- messageCount:", messageCount.current);
        console.log("Message sera affiché:", Boolean(messageText && showMessages));

        if (messageText && showMessages) {
          console.log("✅ Ajout message au chat");
          handleNewMessage(messageText);
        } else {
          console.log("❌ Message ignoré");
        }

      } catch (error) {
        console.error('Erreur traitement message:', error, 'Data:', event.data);
      }
    };

    ws.current.onerror = (error) => {
      console.error("❌ WebSocket erreur:", error);
      setError("Erreur de connexion");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setInput('');
    setIsLoading(true);

    try {
      console.log(`📤 Envoi message utilisateur: "${input.trim()}"`);
      messageCount.current += 1;
      console.log(`Message count: ${messageCount.current}`);

      setMessages(prev => [...prev, {
        text: input.trim(),
        sender: 'user',
        id: Date.now()
      }]);

      ws.current.send(JSON.stringify({
        type: 'message',
        content: input.trim()
      }));
      console.log('✅ Message envoyé');

    } catch (error) {
      console.error('❌ Erreur envoi:', error);
      setError("Erreur d'envoi");
    } finally {
      setIsLoading(false);
    }
  };

  // ... reste du JSX inchangé ...
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