// components/ChatButton.jsx
import { MessageCircle } from 'lucide-react';

const ChatButton = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 hover:scale-105 ${className}`}
      aria-label="Ouvrir le chat"
    >
      <MessageCircle size={24} />
    </button>
  );
};

export default ChatButton;