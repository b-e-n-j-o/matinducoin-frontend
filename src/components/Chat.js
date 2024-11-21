import React, { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// Fonction pour estimer le nombre de tokens (approximation simple)
const estimateTokens = (text) => {
  // Approximation basée sur les règles GPT :
  // - environ 4 caractères par token pour les langues occidentales
  // - les espaces comptent comme des caractères
  // Cette estimation est conservatrice pour éviter les dépassements
  return Math.ceil(text.length / 3);
};

// Messages de bienvenue
const WELCOME_MESSAGES = [
  "Bonjour et bienvenue chez Matin du Coin ! 🌞 Nous sommes ravis de vous accueillir. Je suis ici pour répondre à toutes vos questions ou vous aider à passer commande. N'hésitez pas à demander ce que vous souhaitez !",
  "Salut et bienvenue chez Matin du Coin ! 🌞 Vous avez des questions ou souhaitez passer commande ? Je suis là pour vous aider avec plaisir !",
  "Bienvenue chez Matin du Coin ! 🌞 Je suis là pour répondre à vos questions et vous accompagner pour passer commande. Dites-moi ce que je peux faire pour vous aider !",
  "Bonjour chez Matin du Coin ! 🌞 Je suis ravi(e) de pouvoir vous aider à explorer nos produits ou à passer une commande. N'hésitez pas à poser vos questions !",
  "Salut et merci de choisir Matin du Coin ! 🌞 Vous pouvez me poser vos questions ou passer une commande directement ici. Je suis là pour vous !"
];

// Fonction pour valider les messages entrants et sortants
const validateInput = (input) => {
  // Limites et contraintes
  const MAX_MESSAGE_LENGTH = 1000;           // Limite en caractères
  const MIN_MESSAGE_LENGTH = 1;
  const MAX_TOKENS = 250;                   // Limite en tokens (~450-500 caractères pour GPT)
  const MAX_MESSAGES_PER_MINUTE = 10;
  
  // Vérification de la longueur en caractères
  if (input.length > MAX_MESSAGE_LENGTH || input.length < MIN_MESSAGE_LENGTH) {
    return {
      isValid: false,
      error: `Le message doit faire entre ${MIN_MESSAGE_LENGTH} et ${MAX_MESSAGE_LENGTH} caractères.`
    };
  }

  // Vérification des tokens
  const estimatedTokens = estimateTokens(input);
  if (estimatedTokens > MAX_TOKENS) {
    return {
      isValid: false,
      error: `Votre message est trop long. Merci de le raccourcir.`
    };
  }

  // Expression régulière pour détecter les caractères et patterns malveillants
  const MALICIOUS_PATTERNS = [
    /<script\b[^>]*>([\s\S]*?)<\/script>/gi,
    /javascript:/gi,
    /data:/gi,
    /&lt;script&gt;/gi,
    /onclick/gi,
    /onerror/gi,
    /onload/gi,
    /<iframe/gi,
    /eval\(/gi,
    /alert\(/gi,
    /document\./gi,
    /window\./gi,
    /\[\s*?\$\s*?\{.*?\}\s*?\]/g,
    /{{.*?}}/g,
  ];

  // Vérification des patterns malveillants
  for (const pattern of MALICIOUS_PATTERNS) {
    if (pattern.test(input)) {
      return {
        isValid: false,
        error: "Le message contient du contenu non autorisé."
      };
    }
  }

  return { 
    isValid: true,
    tokens: estimatedTokens 
  };
};

// Classe pour limiter le nombre de requêtes
class RateLimiter {
  constructor(maxRequests, timeWindow) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }

  tryRequest() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }
}

// Fonction pour nettoyer le texte des caractères dangereux
const sanitizeText = (text) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
};

const decodeHTMLEntities = (text) => {
  const decoder = {
    '&#039;': "'",
    '&quot;': '"',
    '&lt;': '<', 
    '&gt;': '>',
    '&amp;': '&',
    '&apos;': "'",
    '&#39;': "'",
    '&nbsp;': ' ',
    '&copy;': '©',
    '&reg;': '®',
    '&deg;': '°',
    '&plusmn;': '±',
    '&para;': '¶',
    '&sect;': '§',
    '&cent;': '¢',
    '&euro;': '€',
    '&pound;': '£',
    '&laquo;': '«',
    '&raquo;': '»',
    '&bull;': '•',
    '&trade;': '™',
    '&times;': '×',
    '&divide;': '÷',
    '&mdash;': '—',
    '&ndash;': '–',
    '&hellip;': '…',
    '&agrave;': 'à',
    '&aacute;': 'á',
    '&egrave;': 'è',
    '&eacute;': 'é',
    '&ecirc;': 'ê',
    '&icirc;': 'î',
    '&iuml;': 'ï',
    '&ocirc;': 'ô',
    '&ugrave;': 'ù',
    '&ucirc;': 'û',
    '&ccedil;': 'ç'
  };

  return text.replace(/&[#\w]+;/g, match => decoder[match] || match);
};

const formatBotMessage = (message) => {
  if (!message) return '';

  try {
    if (typeof message === 'string') {
      try {
        const parsed = JSON.parse(message);
        return decodeHTMLEntities(cleanMessageContent(parsed.content || parsed.message || message));
      } catch {
        return decodeHTMLEntities(cleanMessageContent(message));
      }
    }

    if (typeof message === 'object') {
      return decodeHTMLEntities(cleanMessageContent(
        message.content || message.message || JSON.stringify(message)
      ));
    }

    return decodeHTMLEntities(cleanMessageContent(message.toString()));
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
    .trim();
};

const isValidMessage = (message) => {
  if (!message) return false;

  const invalidPatterns = [
    'Erreur interne du chatbot',
    'SYSTEM:',
    'None',
    'undefined',
    '[object Object]'
  ];

  const containsInvalidPattern = invalidPatterns.some(pattern => 
    message.toString().includes(pattern)
  );

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
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [tokenCount, setTokenCount] = useState(0);
  const messagesEndRef = useRef(null);
  const ws = useRef(null);
  const rateLimiter = useRef(new RateLimiter(20, 60000)); // 20 messages/minute

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const tokens = estimateTokens(input);
    setTokenCount(tokens);
  }, [input]);

  useEffect(() => {
    // Afficher un message de bienvenue aléatoire immédiatement
    const welcomeMessage = WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)];
    setMessages([{
      text: welcomeMessage,
      sender: 'assistant',
      id: Date.now(),
      typing: true
    }]);

    // Initialiser la connexion WebSocket
    ws.current = new WebSocket('wss://matinducoin-backend-b2f47bd8118b.herokuapp.com');

    ws.current.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      setError("La connexion a été perdue");
    };

    ws.current.onmessage = (event) => {
      try {
        let message = event.data;
        let formattedMessage;

        try {
          const parsed = JSON.parse(message);
          formattedMessage = formatBotMessage(parsed);
        } catch {
          formattedMessage = formatBotMessage(message);
        }

        if (formattedMessage && isValidMessage(formattedMessage)) {
          setIsTyping(true);
          setMessages(prev => [...prev, {
            text: decodeHTMLEntities(sanitizeText(formattedMessage)),
            sender: 'assistant',
            id: Date.now(),
            typing: true
          }]);
        }
      } catch (error) {
        console.error('Erreur de traitement:', error);
        setError("Erreur lors du traitement du message");
      }
    };

    ws.current.onerror = (error) => {
      console.error('Erreur WebSocket:', error);
      setError("Une erreur de connexion est survenue");
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!input.trim() || isLoading || !ws.current) return;

    if (!isConnected) {
      setError("La connexion au chatbot a été perdue. Veuillez rafraîchir la page.");
      return;
    }

    // Validation avec vérification des tokens
    const sanitizedInput = sanitizeText(input.trim());
    const validationResult = validateInput(sanitizedInput);

    if (!validationResult.isValid) {
      setError(validationResult.error);
      return;
    }

    setInput('');
    setIsLoading(true);
    setTokenCount(0);

    setMessages(prev => [...prev, {
      text: sanitizedInput,
      sender: 'user',
      id: Date.now()
    }]);

    try {
      ws.current.send(JSON.stringify({
        type: 'message',
        content: sanitizedInput,
        tokenCount: validationResult.tokens
      }));
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      setError("Erreur lors de l'envoi du message. Veuillez réessayer.");
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 w-[350px] bg-white rounded-lg shadow-xl flex flex-col h-[600px]">
      <div className="p-4 bg-[#ff5900] text-[#ffd97f] flex justify-between items-center font-['Bobby_Jones_Soft',_sans-serif]">
        <h3 className="text-lg">Discutez ou passez commande</h3>
        <button 
          onClick={onClose} 
          className="hover:text-white transition-colors text-2xl"
          aria-label="Fermer le chat"
        >
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

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
        {/* Ce formulaire gère la saisie et l'envoi des messages dans le chat */}
        <div className="flex flex-col space-y-2">
          {/* Affiche le nombre de tokens utilisés avec un avertissement visuel si > 240 */}
          {tokenCount > 0 && (
            <div className={`text-xs ${tokenCount > 240 ? 'text-orange-500' : 'text-gray-500'}`}>
              {/* Commenté: Affichage du compte de tokens */}
            </div>
          )}
          {/* Conteneur pour le champ de saisie et le bouton d'envoi */}
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
              disabled={isLoading || isTyping || tokenCount > 150}
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

export default Chat;