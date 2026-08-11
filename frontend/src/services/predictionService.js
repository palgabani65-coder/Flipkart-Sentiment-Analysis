import { MOCK_HISTORY } from './mockData';

// Keywords dictionary for intelligent client-side sentiment evaluation fallback
const POSITIVE_KEYWORDS = [
  'great', 'excellent', 'amazing', 'awesome', 'best', 'love', 'fantastic', 'superb', 
  'flawless', 'smooth', 'fast', 'crisp', 'mindblowing', 'unbelievable', 'lightweight', 
  'punchy', 'clear', 'good', 'worth', 'value', 'top', 'durable', 'premium', 'brilliant'
];

const NEGATIVE_KEYWORDS = [
  'terrible', 'worst', 'horrible', 'bad', 'disappointed', 'waste', 'heating', 'heat', 
  'slow', 'lag', 'laggy', 'jammed', 'broken', 'stopped', 'defective', 'drain', 'expensive', 
  'flimsy', 'loud', 'delay', 'issue', 'scam', 'poor', 'trash'
];

const ASPECT_DICTIONARY = [
  { keywords: ['camera', 'photo', 'picture', 'zoom', 'lens', 'night mode'], name: 'Camera Quality' },
  { keywords: ['battery', 'charge', 'charging', 'drain', 'backup', 'mah'], name: 'Battery Performance' },
  { keywords: ['display', 'screen', 'oled', 'refresh rate', 'bright', 'brightness'], name: 'Display & Screen' },
  { keywords: ['heating', 'heat', 'warm', 'temperature', 'thermal'], name: 'Thermal Management' },
  { keywords: ['sound', 'audio', 'bass', 'speaker', 'mic', 'noise', 'anc'], name: 'Audio & Acoustics' },
  { keywords: ['build', 'design', 'finish', 'titanium', 'plastic', 'flimsy', 'heavy'], name: 'Design & Build' },
  { keywords: ['delivery', 'flipkart', 'shipping', 'package', 'seller'], name: 'Delivery & Logistics' },
  { keywords: ['service', 'support', 'warranty', 'replacement'], name: 'Customer Service' },
];

export const predictionService = {
  predictSingle: async (reviewText, productName = 'Generic Flipkart Item') => {
    await new Promise((resolve) => setTimeout(resolve, 850));

    if (!reviewText || reviewText.trim().length < 5) {
      throw new Error('Please enter a review text with at least 5 characters.');
    }

    const textLower = reviewText.toLowerCase();
    
    let posCount = 0;
    let negCount = 0;

    POSITIVE_KEYWORDS.forEach((word) => {
      if (textLower.includes(word)) posCount++;
    });

    NEGATIVE_KEYWORDS.forEach((word) => {
      if (textLower.includes(word)) negCount++;
    });

    let sentiment = 'Neutral';
    let confidence = 85.0;

    if (posCount > negCount) {
      sentiment = 'Positive';
      confidence = Math.min(99.4, 88.0 + posCount * 3.2 - negCount * 1.5);
    } else if (negCount > posCount) {
      sentiment = 'Negative';
      confidence = Math.min(98.8, 86.5 + negCount * 3.5 - posCount * 1.2);
    } else {
      sentiment = 'Neutral';
      confidence = 78.5 + Math.random() * 8;
    }

    // Aspect Detection
    const detectedAspects = [];
    ASPECT_DICTIONARY.forEach((aspectGroup) => {
      const matched = aspectGroup.keywords.some((kw) => textLower.includes(kw));
      if (matched) {
        let aspectSentiment = sentiment;
        // Check local context
        const hasPos = POSITIVE_KEYWORDS.some((kw) => textLower.includes(kw));
        const hasNeg = NEGATIVE_KEYWORDS.some((kw) => textLower.includes(kw));
        if (hasPos && !hasNeg) aspectSentiment = 'Positive';
        if (hasNeg && !hasPos) aspectSentiment = 'Negative';

        detectedAspects.push({
          name: aspectGroup.name,
          sentiment: aspectSentiment,
          score: Math.round(confidence - (Math.random() * 5))
        });
      }
    });

    if (detectedAspects.length === 0) {
      detectedAspects.push({ name: 'General Impression', sentiment: sentiment, score: Math.round(confidence) });
    }

    const result = {
      id: 'pred_' + Date.now(),
      reviewText: reviewText,
      productName: productName,
      sentiment: sentiment,
      confidence: parseFloat(confidence.toFixed(1)),
      aspects: detectedAspects,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    // Save to local history
    predictionService.saveToHistory(result);

    return result;
  },

  predictBatch: async (reviewsList) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const results = [];
    for (let i = 0; i < reviewsList.length; i++) {
      const item = reviewsList[i];
      const text = typeof item === 'string' ? item : item.text;
      const prod = typeof item === 'string' ? 'Batch Upload Review' : (item.productName || 'Batch Item');
      
      const pred = await predictionService.predictSingle(text, prod);
      results.push(pred);
    }

    return results;
  },

  getHistory: () => {
    const localHist = localStorage.getItem('fk_history');
    return localHist ? JSON.parse(localHist) : MOCK_HISTORY;
  },

  saveToHistory: (newItem) => {
    const current = predictionService.getHistory();
    const updated = [newItem, ...current];
    localStorage.setItem('fk_history', JSON.stringify(updated.slice(0, 50)));
  },

  clearHistory: () => {
    localStorage.removeItem('fk_history');
  },

  deleteHistoryItem: (id) => {
    const current = predictionService.getHistory();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem('fk_history', JSON.stringify(updated));
    return updated;
  }
};
