export const MOCK_USER = {
  id: 'usr_101',
  name: 'Ananya Sharma',
  email: 'ananya.sharma@flipkart.com',
  role: 'Data Analyst & Review Manager',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  apiKey: 'flkp_live_99a823b17c09e4f21a8d0e7b',
  joinedDate: '2024-03-15',
  stats: {
    totalPredictions: 142,
    accuracyRate: 98.4,
    savedProducts: 18,
  }
};

export const MOCK_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'Apple iPhone 15 Pro (128 GB) - Natural Titanium',
    category: 'Mobiles',
    brand: 'Apple',
    price: 127999,
    originalPrice: 134900,
    discount: '5% off',
    rating: 4.6,
    totalReviews: 2450,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=80',
    sentimentSummary: {
      positive: 78,
      neutral: 14,
      negative: 8,
      avgConfidence: 94.2
    },
    aspects: [
      { name: 'Camera Quality', sentiment: 'Positive', score: 96 },
      { name: 'Battery Life', sentiment: 'Neutral', score: 68 },
      { name: 'Design & Finish', sentiment: 'Positive', score: 98 },
      { name: 'Heating / Thermal', sentiment: 'Negative', score: 42 }
    ]
  },
  {
    id: 'prod-002',
    name: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)',
    category: 'Mobiles',
    brand: 'Samsung',
    price: 129999,
    originalPrice: 144999,
    discount: '10% off',
    rating: 4.7,
    totalReviews: 1890,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=80',
    sentimentSummary: {
      positive: 82,
      neutral: 11,
      negative: 7,
      avgConfidence: 96.1
    },
    aspects: [
      { name: 'S-Pen Features', sentiment: 'Positive', score: 94 },
      { name: 'Display Brightness', sentiment: 'Positive', score: 99 },
      { name: 'Zoom Camera', sentiment: 'Positive', score: 97 },
      { name: 'Weight & Ergonomics', sentiment: 'Neutral', score: 65 }
    ]
  },
  {
    id: 'prod-003',
    name: 'Sony WH-1000XM5 Wireless ANC Headphones',
    category: 'Audio',
    brand: 'Sony',
    price: 26990,
    originalPrice: 34990,
    discount: '22% off',
    rating: 4.5,
    totalReviews: 3120,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    sentimentSummary: {
      positive: 84,
      neutral: 10,
      negative: 6,
      avgConfidence: 95.0
    },
    aspects: [
      { name: 'Active Noise Cancellation', sentiment: 'Positive', score: 98 },
      { name: 'Bass Response', sentiment: 'Positive', score: 92 },
      { name: 'Mic Clarity', sentiment: 'Neutral', score: 71 },
      { name: 'Case Portability', sentiment: 'Negative', score: 48 }
    ]
  },
  {
    id: 'prod-004',
    name: 'ASUS ROG Zephyrus G16 Gaming Laptop (2024)',
    category: 'Laptops',
    brand: 'ASUS',
    price: 189990,
    originalPrice: 219990,
    discount: '13% off',
    rating: 4.4,
    totalReviews: 640,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=80',
    sentimentSummary: {
      positive: 72,
      neutral: 16,
      negative: 12,
      avgConfidence: 91.8
    },
    aspects: [
      { name: 'OLED Display', sentiment: 'Positive', score: 99 },
      { name: 'GPU Performance', sentiment: 'Positive', score: 95 },
      { name: 'Fan Noise', sentiment: 'Negative', score: 38 },
      { name: 'Keyboard Tactility', sentiment: 'Positive', score: 88 }
    ]
  },
  {
    id: 'prod-005',
    name: 'Nike Air Jordan 1 Retro High OG (Chicago Colorway)',
    category: 'Fashion',
    brand: 'Nike',
    price: 16995,
    originalPrice: 19995,
    discount: '15% off',
    rating: 4.8,
    totalReviews: 4200,
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&auto=format&fit=crop&q=80',
    sentimentSummary: {
      positive: 91,
      neutral: 6,
      negative: 3,
      avgConfidence: 97.5
    },
    aspects: [
      { name: 'Leather Quality', sentiment: 'Positive', score: 96 },
      { name: 'Iconic Style', sentiment: 'Positive', score: 100 },
      { name: 'Sole Comfort', sentiment: 'Neutral', score: 74 },
      { name: 'Sizing Fit', sentiment: 'Positive', score: 89 }
    ]
  },
  {
    id: 'prod-006',
    name: 'Dyson V15 Detect Cordless Vacuum Cleaner',
    category: 'Appliances',
    brand: 'Dyson',
    price: 62900,
    originalPrice: 65900,
    discount: '4% off',
    rating: 4.3,
    totalReviews: 890,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&auto=format&fit=crop&q=80',
    sentimentSummary: {
      positive: 68,
      neutral: 17,
      negative: 15,
      avgConfidence: 89.4
    },
    aspects: [
      { name: 'Suction Power', sentiment: 'Positive', score: 95 },
      { name: 'Laser Illumination', sentiment: 'Positive', score: 92 },
      { name: 'Battery Runtime', sentiment: 'Negative', score: 45 },
      { name: 'Dust Bin Cleanup', sentiment: 'Neutral', score: 60 }
    ]
  }
];

export const MOCK_REVIEWS = [
  {
    id: 'rev-101',
    productId: 'prod-001',
    productName: 'Apple iPhone 15 Pro',
    user: 'Rohan Mehta',
    rating: 5,
    title: 'Mindblowing Camera & Build Quality!',
    comment: 'The titanium finish feels super lightweight compared to 14 Pro. The 5x optical zoom camera is unbelievable in low light settings. Battery lasts easily a full day.',
    sentiment: 'Positive',
    confidence: 98.7,
    aspects: [
      { name: 'Camera', sentiment: 'Positive' },
      { name: 'Weight', sentiment: 'Positive' },
      { name: 'Battery', sentiment: 'Positive' }
    ],
    date: '2026-08-01',
    verifiedPurchase: true
  },
  {
    id: 'rev-102',
    productId: 'prod-001',
    productName: 'Apple iPhone 15 Pro',
    user: 'Priya Nair',
    rating: 2,
    title: 'Gets very hot while gaming and fast charging',
    comment: 'Extremely disappointed with thermal management. Phone reaches 44 degrees Celsius while playing BGMI for 20 minutes. Battery drains fast during video calls.',
    sentiment: 'Negative',
    confidence: 94.1,
    aspects: [
      { name: 'Heating', sentiment: 'Negative' },
      { name: 'Battery Drain', sentiment: 'Negative' }
    ],
    date: '2026-07-28',
    verifiedPurchase: true
  },
  {
    id: 'rev-103',
    productId: 'prod-003',
    productName: 'Sony WH-1000XM5',
    user: 'Amitabh Sen',
    rating: 5,
    title: 'Best Noise Cancellation in the World',
    comment: 'I fly frequently for work and these completely silence jet engine rumble. Audio staging is rich with punchy bass. Best purchase on Flipkart Big Billion Days!',
    sentiment: 'Positive',
    confidence: 99.2,
    aspects: [
      { name: 'Noise Cancellation', sentiment: 'Positive' },
      { name: 'Sound Quality', sentiment: 'Positive' }
    ],
    date: '2026-08-03',
    verifiedPurchase: true
  },
  {
    id: 'rev-104',
    productId: 'prod-004',
    productName: 'ASUS ROG Zephyrus G16',
    user: 'Karan Malhotra',
    rating: 3,
    title: 'Great screen, but loud fan noise under heavy loads',
    comment: 'The OLED panel is absolute magic for movie viewing and color accuracy. However, fans sound like a jet taking off when rendering 4K videos in Premiere Pro.',
    sentiment: 'Neutral',
    confidence: 86.4,
    aspects: [
      { name: 'OLED Display', sentiment: 'Positive' },
      { name: 'Fan Noise', sentiment: 'Negative' }
    ],
    date: '2026-07-30',
    verifiedPurchase: true
  },
  {
    id: 'rev-105',
    productId: 'prod-006',
    productName: 'Dyson V15 Detect',
    user: 'Sneha Verma',
    rating: 1,
    title: 'Stopped working after 2 months. Horrible customer service.',
    comment: 'The motor unit jammed completely after minor use. Flipkart support pushed me to Dyson service center which has been delaying replacement for 3 weeks.',
    sentiment: 'Negative',
    confidence: 96.8,
    aspects: [
      { name: 'Reliability', sentiment: 'Negative' },
      { name: 'Customer Service', sentiment: 'Negative' }
    ],
    date: '2026-08-04',
    verifiedPurchase: true
  }
];

export const MOCK_ANALYTICS = {
  totalAnalyzed: 14850,
  overallPositivePercent: 74.2,
  overallNeutralPercent: 14.3,
  overallNegativePercent: 11.5,
  avgConfidenceScore: 93.8,
  
  ratingVsSentiment: [
    { rating: '1 Star', positive: 5, neutral: 12, negative: 83 },
    { rating: '2 Stars', positive: 12, neutral: 28, negative: 60 },
    { rating: '3 Stars', positive: 35, neutral: 52, negative: 13 },
    { rating: '4 Stars', positive: 82, neutral: 14, negative: 4 },
    { rating: '5 Stars', positive: 94, neutral: 5, negative: 1 }
  ],
  
  monthlyTrends: [
    { month: 'Feb', positive: 68, neutral: 18, negative: 14 },
    { month: 'Mar', positive: 70, neutral: 17, negative: 13 },
    { month: 'Apr', positive: 72, neutral: 16, negative: 12 },
    { month: 'May', positive: 71, neutral: 15, negative: 14 },
    { month: 'Jun', positive: 76, neutral: 14, negative: 10 },
    { month: 'Jul', positive: 75, neutral: 14, negative: 11 },
    { month: 'Aug', positive: 78, neutral: 13, negative: 9 }
  ],

  categoryBreakdown: [
    { category: 'Mobiles', positive: 76, neutral: 14, negative: 10 },
    { category: 'Audio', positive: 84, neutral: 10, negative: 6 },
    { category: 'Laptops', positive: 71, neutral: 16, negative: 13 },
    { category: 'Fashion', positive: 88, neutral: 8, negative: 4 },
    { category: 'Appliances', positive: 65, neutral: 18, negative: 17 }
  ],

  topPositiveAspects: [
    { aspect: 'Build Quality', count: 3420, sentimentScore: 96 },
    { aspect: 'Camera Performance', count: 2890, sentimentScore: 94 },
    { aspect: 'Fast Delivery', count: 2410, sentimentScore: 92 },
    { aspect: 'Value for Money', count: 2150, sentimentScore: 89 },
    { aspect: 'Battery Backup', count: 1890, sentimentScore: 88 }
  ],

  topNegativeAspects: [
    { aspect: 'Heating Issues', count: 980, sentimentScore: 28 },
    { aspect: 'Customer Service Delay', count: 840, sentimentScore: 22 },
    { aspect: 'App Crashes / Software Bugs', count: 620, sentimentScore: 31 },
    { aspect: 'Packaging Damage', count: 540, sentimentScore: 35 },
    { aspect: 'Weight / Bulkiness', count: 410, sentimentScore: 42 }
  ]
};

export const MOCK_HISTORY = [
  {
    id: 'hist-1',
    reviewText: 'The camera is top notch and screen refresh rate is super fluid! Battery easily lasts 1.5 days.',
    sentiment: 'Positive',
    confidence: 97.4,
    productName: 'Samsung Galaxy S24 Ultra',
    timestamp: '2026-08-05 18:24:10',
    aspects: ['Camera', 'Display', 'Battery']
  },
  {
    id: 'hist-2',
    reviewText: 'Very laggy touch screen after recent update. Heating issue is unbearable.',
    sentiment: 'Negative',
    confidence: 95.8,
    productName: 'Budget Smartphone X',
    timestamp: '2026-08-05 14:10:05',
    aspects: ['Performance', 'Heating', 'Display']
  },
  {
    id: 'hist-3',
    reviewText: 'Average sound quality. ANC works okay, but case feels flimsy.',
    sentiment: 'Neutral',
    confidence: 83.2,
    productName: 'Wireless Earbuds Pro',
    timestamp: '2026-08-04 19:45:30',
    aspects: ['Sound Quality', 'ANC', 'Build']
  }
];
