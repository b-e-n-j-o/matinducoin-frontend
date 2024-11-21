import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

// Enum pour les étapes de commande
const OrderStep = {
  FLAVOR: 'FLAVOR',
  NAME: 'NAME', 
  ADDRESS: 'ADDRESS',
  DELIVERY_DATE: 'DELIVERY_DATE',
  EMAIL: 'EMAIL',
  CONFIRMATION: 'CONFIRMATION',
  COMPLETE: 'COMPLETE'
};

const ProductInfo = {
  PRODUCTS: {
    'reveil soleil': { price: 2.99 },
    'matcha matin': { price: 3.49 },
    'berry balance': { price: 3.49 }
  }
};

const OrderChat = () => {
  const [messages, setMessages] = useState([
    { type: 'bot', content: "Bonjour! Voici nos produits disponibles:\n" +
      "- Reveil Soleil (2.99€) : Shot énergisant au gingembre\n" +
      "- Matcha Matin (3.49€) : Shot au matcha et gingembre\n" +
      "- Berry Balance (3.49€) : Shot aux baies et gingembre\n\n" +
      "Quels produits souhaitez-vous commander et en quelle quantité?" }
  ]);
  const [userInput, setUserInput] = useState('');
  const [orderState, setOrderState] = useState({
    step: OrderStep.FLAVOR,
    currentOrder: {}
  });
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (content, type = 'bot') => {
    setMessages(prev => [...prev, { type, content }]);
  };

  const parseFlavorInput = (input) => {
    let products = {};
    let total_price = 0;
    const validProducts = ['reveil soleil', 'matcha matin', 'berry balance'];
    
    // Normaliser l'entrée en minuscules
    const lowercaseInput = input.toLowerCase();
    
    // Rechercher les motifs de quantité (ex: "2 reveil soleil" ou "reveil soleil x2")
    for (const product of validProducts) {
      const regex1 = new RegExp(`(\\d+)\\s*${product}`, 'i');
      const regex2 = new RegExp(`${product}\\s*x\\s*(\\d+)`, 'i');
      const regex3 = new RegExp(`${product}\\s*:\\s*(\\d+)`, 'i');
      
      const match = lowercaseInput.match(regex1) || 
                   lowercaseInput.match(regex2) || 
                   lowercaseInput.match(regex3);
      
      if (match) {
        const quantity = parseInt(match[1]);
        if (quantity > 0 && quantity <= 10) {
          products[product] = quantity;
          total_price += quantity * ProductInfo.PRODUCTS[product].price;
        }
      }
    }

    if (Object.keys(products).length === 0) {
      return {
        status: "retry",
        message: "Je n'ai pas bien compris votre commande. Pouvez-vous préciser les produits et quantités? Par exemple: '2 Reveil Soleil et 1 Matcha Matin'"
      };
    }

    // Formater le message de confirmation
    let confirmationMsg = "J'ai bien noté votre commande :\n";
    for (const [product, quantity] of Object.entries(products)) {
      const price = ProductInfo.PRODUCTS[product].price;
      confirmationMsg += `- ${product} : ${quantity} x ${price}€ = ${(price * quantity).toFixed(2)}€\n`;
    }
    confirmationMsg += `\nTotal : ${total_price.toFixed(2)}€\n\nQuel est votre nom ?`;

    return {
      status: "success",
      products,
      total_price,
      message: confirmationMsg
    };
  };

  const validateAddress = (address) => {
    // Vérifier si le code postal est présent
    const postalRegex = /[Hh][0-9][A-Za-z]\s*[0-9][A-Za-z][0-9]/;
    if (!postalRegex.test(address)) {
      return {
        status: "retry",
        message: "Veuillez fournir une adresse complète avec un code postal valide au format H2X 2X2"
      };
    }

    // Vérifier les zones de livraison
    const postalCode = address.match(postalRegex)[0].toUpperCase();
    const validZones = ['H2V', 'H2T', 'H2J', 'H2L', 'H2W'];
    const zonePrefix = postalCode.substring(0, 3);

    if (!validZones.includes(zonePrefix)) {
      return {
        status: "retry",
        message: "Désolé, nous ne livrons pas dans cette zone. Nos zones de livraison sont : Outremont (H2V), Mile End (H2T), Laurier (H2J), Le Plateau (H2L), et Jeanne Mance (H2W)."
      };
    }

    return {
      status: "success",
      message: `Parfait! Maintenant, quand souhaitez-vous être livré? Nous livrons les lundis et jeudis.`
    };
  };

  const validateDate = (dateInput) => {
    try {
      // Convertir les expressions en dates
      let targetDate;
      const today = new Date();
      const dayNames = {
        'lundi': 1,
        'jeudi': 4,
        'monday': 1,
        'thursday': 4
      };

      // Gérer les expressions relatives
      if (dateInput.toLowerCase().includes('prochain')) {
        const dayName = Object.keys(dayNames).find(day => dateInput.toLowerCase().includes(day));
        if (dayName) {
          targetDate = getNextDay(today, dayNames[dayName]);
        }
      } else {
        // Essayer de parser la date directement
        targetDate = new Date(dateInput);
      }

      if (isNaN(targetDate.getTime())) {
        return {
          status: "retry",
          message: "Je n'ai pas compris la date. Pouvez-vous préciser un lundi ou un jeudi ?"
        };
      }

      // Vérifier si c'est un lundi ou jeudi
      const dayOfWeek = targetDate.getDay();
      if (dayOfWeek !== 1 && dayOfWeek !== 4) {
        return {
          status: "retry",
          message: "Nous livrons uniquement les lundis et jeudis. Veuillez choisir l'un de ces jours."
        };
      }

      // Vérifier si la date n'est pas dans le passé
      if (targetDate < today) {
        return {
          status: "retry",
          message: "La date ne peut pas être dans le passé. Veuillez choisir une date future."
        };
      }

      return {
        status: "success",
        date: targetDate.toISOString().split('T')[0],
        message: `Date validée pour le ${targetDate.toLocaleDateString('fr-FR')}! Quel est votre email pour la confirmation de commande ?`
      };
    } catch (error) {
      return {
        status: "retry",
        message: "Format de date invalide. Veuillez spécifier un lundi ou un jeudi."
      };
    }
  };

  const getNextDay = (date, targetDay) => {
    const result = new Date(date);
    result.setDate(date.getDate() + (7 + targetDay - date.getDay()) % 7);
    if (result <= date) {
      result.setDate(result.getDate() + 7);
    }
    return result;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return {
        status: "retry",
        message: "L'email n'est pas valide. Veuillez entrer une adresse email valide."
      };
    }
    return {
        status: "success",
        message: generateOrderSummary({ ...orderState.currentOrder, email })
    };
  };

  const generateOrderSummary = (order) => {
    let summary = `Voici le récapitulatif de votre commande :\n\n`;
    summary += `👤 Nom : ${order.name}\n`;
    summary += `📍 Adresse : ${order.address}\n`;
    summary += `📅 Date de livraison : ${new Date(order.deliveryDate).toLocaleDateString('fr-FR')}\n`;
    summary += `📧 Email : ${order.email}\n\n`;
    summary += `🛒 Produits commandés :\n`;
    
    for (const [product, quantity] of Object.entries(order.products)) {
      const price = ProductInfo.PRODUCTS[product].price;
      summary += `   - ${product} : ${quantity} x ${price}€ = ${(price * quantity).toFixed(2)}€\n`;
    }
    
    summary += `\n💰 Total : ${order.totalPrice.toFixed(2)}€\n\n`;
    summary += `Est-ce que ces informations sont correctes ? (oui/non)`;
    
    return summary;
  };

  const submitOrder = async (orderData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: orderData.name,
          address: orderData.address,
          deliveryDate: orderData.deliveryDate,
          email: orderData.email,
          flavor: Object.entries(orderData.products)
            .map(([product, quantity]) => `${product}:${quantity}`)
            .join(', ')
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la soumission de la commande');
      }

      return {
        status: 'success',
        message: "Votre commande a été créée avec succès! Un email de confirmation vous a été envoyé. Que puis-je faire d'autre pour vous?"
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Erreur lors de la création de la commande: ${error.message}`
      };
    }
  };

  const handleUserInput = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    addMessage(userInput, 'user');
    const currentInput = userInput;
    setUserInput('');

    switch (orderState.step) {
      case OrderStep.FLAVOR:
        const flavorResult = parseFlavorInput(currentInput);
        if (flavorResult.status === "success") {
          setOrderState(prev => ({
            ...prev,
            step: OrderStep.NAME,
            currentOrder: {
              ...prev.currentOrder,
              products: flavorResult.products,
              totalPrice: flavorResult.total_price
            }
          }));
        }
        addMessage(flavorResult.message);
        break;

      case OrderStep.NAME:
        if (currentInput.trim()) {
          setOrderState(prev => ({
            ...prev,
            step: OrderStep.ADDRESS,
            currentOrder: { ...prev.currentOrder, name: currentInput }
          }));
          addMessage("Merci! Quelle est votre adresse de livraison? (incluez le code postal)");
        } else {
          addMessage("Le nom ne peut pas être vide. Veuillez entrer votre nom.");
        }
        break;

      case OrderStep.ADDRESS:
        const addressResult = validateAddress(currentInput);
        if (addressResult.status === "success") {
          setOrderState(prev => ({
            ...prev,
            step: OrderStep.DELIVERY_DATE,
            currentOrder: { ...prev.currentOrder, address: currentInput }
          }));
        }
        addMessage(addressResult.message);
        break;

      case OrderStep.DELIVERY_DATE:
        const dateResult = validateDate(currentInput);
        if (dateResult.status === "success") {
          setOrderState(prev => ({
            ...prev,
            step: OrderStep.EMAIL,
            currentOrder: { ...prev.currentOrder, deliveryDate: dateResult.date }
          }));
        }
        addMessage(dateResult.message);
        break;

      case OrderStep.EMAIL:
        const emailResult = validateEmail(currentInput);
        if (emailResult.status === "success") {
          setOrderState(prev => ({
            ...prev,
            step: OrderStep.CONFIRMATION,
            currentOrder: { ...prev.currentOrder, email: currentInput }
          }));
        }
        addMessage(emailResult.message);
        break;

      case OrderStep.CONFIRMATION:
        if (currentInput.toLowerCase() === 'oui') {
          const submitResult = await submitOrder(orderState.currentOrder);
          addMessage(submitResult.message);
          if (submitResult.status === 'success') {
            setOrderState({ step: OrderStep.FLAVOR, currentOrder: {} });
          }
        } else {
          setOrderState({ step: OrderStep.FLAVOR, currentOrder: {} });
          addMessage("D'accord, reprenons depuis le début. Voici nos produits disponibles:\n" +
            "- Reveil Soleil (2.99€) : Shot énergisant au gingembre\n" +
            "- Matcha Matin (3.49€) : Shot au matcha et gingembre\n" +
            "- Berry Balance (3.49€) : Shot aux baies et gingembre\n\n" +
            "Quels produits souhaitez-vous commander et en quelle quantité?");
        }
        break;
    }
  };

  return (
    <div className="w-full h-[600px] flex flex-col bg-white rounded-lg shadow-lg">
      <div className="flex-1 p-4 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.content.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleUserInput} className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Tapez votre message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderChat;