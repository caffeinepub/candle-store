interface ResponseRule {
  keywords: string[];
  responses: string[];
}

const rules: ResponseRule[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'namaste', 'hii', 'helo'],
    responses: [
      "Hello! 🕯️ Welcome to Luminary Candles! How can I help you today?",
      "Hi there! I'm your Luminary assistant. Ask me anything about our candles!",
    ],
  },
  {
    keywords: ['candle', 'candles', 'type', 'types', 'variety', 'varieties', 'collection'],
    responses: [
      "We offer a beautiful range of handcrafted candles! 🕯️\n\n• **Soy Wax Candles** – Clean burn, long-lasting\n• **Beeswax Candles** – Natural & air-purifying\n• **Scented Candles** – Aromatherapy blends\n• **Pillar Candles** – Decorative & elegant\n• **Tea Light Candles** – Perfect for ambiance\n\nBrowse our full collection on the Shop page!",
    ],
  },
  {
    keywords: ['scent', 'scents', 'fragrance', 'fragrances', 'smell', 'aroma'],
    responses: [
      "Our candles come in wonderful fragrances! 🌸\n\n• **Lavender & Vanilla** – Calming & sweet\n• **Rose & Sandalwood** – Romantic & warm\n• **Jasmine & Musk** – Exotic & sensual\n• **Citrus & Mint** – Fresh & energizing\n• **Oud & Amber** – Rich & luxurious\n\nEach scent is carefully crafted for a long-lasting experience!",
    ],
  },
  {
    keywords: ['price', 'cost', 'how much', 'rate', 'pricing', 'cheap', 'expensive'],
    responses: [
      "Our candles are priced to suit every budget! 💰\n\nPrices range from ₹299 to ₹2,499 depending on size and type. Check individual product pages for exact pricing. We also offer bundle deals for great savings!",
    ],
  },
  {
    keywords: ['delivery', 'shipping', 'ship', 'deliver', 'dispatch', 'courier'],
    responses: [
      "📦 Delivery Information:\n\n• **Standard Delivery**: 5-7 business days\n• **Express Delivery**: 2-3 business days\n• **Same Day**: Available in select cities\n\nFree shipping on orders above ₹999! We ship across India via trusted courier partners.",
    ],
  },
  {
    keywords: ['return', 'refund', 'exchange', 'replace', 'broken', 'damaged'],
    responses: [
      "🔄 Our Return Policy:\n\n• 7-day easy returns for unused items\n• Damaged items replaced free of charge\n• Refund processed within 5-7 business days\n\nTo initiate a return, please contact our support team via the Customer Care page.",
    ],
  },
  {
    keywords: ['order', 'track', 'tracking', 'status', 'where is my'],
    responses: [
      "📍 To track your order:\n\n1. Check your email for a tracking link\n2. Visit our Customer Care page\n3. Contact support with your order ID\n\nOrders are typically dispatched within 24 hours of payment confirmation!",
    ],
  },
  {
    keywords: ['payment', 'pay', 'upi', 'card', 'credit', 'debit', 'stripe'],
    responses: [
      "💳 We accept multiple payment methods:\n\n• Credit & Debit Cards (Visa, Mastercard)\n• UPI (via Stripe's India payment gateway)\n• Net Banking\n• Wallets\n\nAll payments are 100% secure and encrypted!",
    ],
  },
  {
    keywords: ['care', 'maintain', 'how to use', 'burn', 'wick', 'tips'],
    responses: [
      "🕯️ Candle Care Tips:\n\n• Trim wick to 6mm before each burn\n• First burn: let wax pool reach edges\n• Never burn for more than 4 hours\n• Keep away from drafts & flammable items\n• Store in cool, dry place\n\nProper care extends candle life by 30%!",
    ],
  },
  {
    keywords: ['gift', 'gifting', 'present', 'birthday', 'anniversary', 'wedding'],
    responses: [
      "🎁 Candles make perfect gifts! We offer:\n\n• Beautiful gift packaging\n• Custom message cards\n• Gift sets & hampers\n• Corporate gifting options\n\nVisit our shop and look for 'Gift Sets' category for curated collections!",
    ],
  },
  {
    keywords: ['reward', 'rewards', 'points', 'loyalty', 'discount', 'coupon'],
    responses: [
      "⭐ Luminary Rewards Program:\n\n• Earn 1 point per ₹10 spent\n• Redeem points for discounts\n• Special birthday bonuses\n• Exclusive member offers\n\nCheck your Rewards page to see your current points balance!",
    ],
  },
  {
    keywords: ['contact', 'support', 'help', 'customer care', 'phone', 'email'],
    responses: [
      "📞 Customer Support:\n\n• **Email**: support@luminarycandles.in\n• **Phone**: +91 98765 43210\n• **Hours**: Mon-Sat, 9 AM - 7 PM IST\n• **Live Chat**: Available on our Customer Care page\n\nWe typically respond within 2 hours!",
    ],
  },
  {
    keywords: ['wax', 'soy', 'paraffin', 'beeswax', 'natural', 'organic'],
    responses: [
      "🌿 About Our Wax:\n\nWe primarily use **premium soy wax** which is:\n• 100% natural & eco-friendly\n• Burns cleaner than paraffin\n• Longer burn time\n• Better fragrance throw\n\nWe also offer beeswax options for those who prefer natural alternatives!",
    ],
  },
  {
    keywords: ['bye', 'goodbye', 'thanks', 'thank you', 'dhanyawad'],
    responses: [
      "Thank you for visiting Luminary Candles! 🕯️ Have a wonderful day! Feel free to come back anytime.",
      "Goodbye! May your days be as warm and bright as our candles! 🌟",
    ],
  },
];

const fallbackResponses = [
  "I'm not sure about that, but I'd love to help! 🕯️ You can ask me about our candle types, scents, delivery, returns, or payment options. Or visit our Customer Care page for personalized assistance!",
  "Great question! For detailed information, please visit our Customer Care page or browse our Shop. I can help with questions about candles, delivery, returns, and more!",
  "I didn't quite catch that. Try asking about our candle collection, scents, delivery times, or return policy. I'm here to help! 🌸",
];

export function getBotResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  for (const rule of rules) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      const responses = rule.responses;
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}
