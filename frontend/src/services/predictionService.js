import { api } from './api';
import { MOCK_HISTORY } from './mockData';

// Keywords dictionary for fallback aspect detection and offline mode
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

const extractAspects = (textLower, sentiment, confidence) => {
  const detected = [];
  ASPECT_DICTIONARY.forEach((aspectGroup) => {
    const matched = aspectGroup.keywords.some((kw) => textLower.includes(kw));
    if (matched) {
      let aspectSentiment = sentiment;
      const hasPos = POSITIVE_KEYWORDS.some((kw) => textLower.includes(kw));
      const hasNeg = NEGATIVE_KEYWORDS.some((kw) => textLower.includes(kw));
      if (hasPos && !hasNeg) aspectSentiment = 'Positive';
      if (hasNeg && !hasPos) aspectSentiment = 'Negative';

      detected.push({
        name: aspectGroup.name,
        sentiment: aspectSentiment,
        score: Math.round(confidence - (Math.random() * 5))
      });
    }
  });

  if (detected.length === 0) {
    detected.push({ name: 'General Impression', sentiment: sentiment, score: Math.round(confidence) });
  }
  return detected;
};

export const predictionService = {
  predictSingle: async (reviewText, productName = 'Generic Flipkart Item') => {
    if (!reviewText || reviewText.trim().length < 3) {
      throw new Error('Please enter review text with at least 3 characters.');
    }

    const textTrimmed = reviewText.trim();
    const textLower = textTrimmed.toLowerCase();

    let sentiment = 'Neutral';
    let confidence = 85.0;
    let confidenceBreakdown = { positive: 33.3, neutral: 33.4, negative: 33.3 };

    try {
      // Connect directly to FastAPI ML model backend
      const res = await api.post('/predict', { text: textTrimmed });
      const data = res.data;

      const rawSentiment = data.sentiment || 'neutral';
      sentiment = rawSentiment.charAt(0).toUpperCase() + rawSentiment.slice(1).toLowerCase();

      if (data.confidence && typeof data.confidence === 'object') {
        confidenceBreakdown = data.confidence;
        const vals = Object.values(data.confidence);
        const maxVal = Math.max(...vals);
        confidence = parseFloat(maxVal.toFixed(1));
      }
    } catch (err) {
      console.warn('[Backend Prediction Fallback] Using offline client analysis:', err.message);
      // Offline fallback keyword evaluation
      let posCount = 0;
      let negCount = 0;
      POSITIVE_KEYWORDS.forEach((w) => { if (textLower.includes(w)) posCount++; });
      NEGATIVE_KEYWORDS.forEach((w) => { if (textLower.includes(w)) negCount++; });

      if (posCount > negCount) {
        sentiment = 'Positive';
        confidence = Math.min(99.4, 88.0 + posCount * 3.2 - negCount * 1.5);
      } else if (negCount > posCount) {
        sentiment = 'Negative';
        confidence = Math.min(98.8, 86.5 + negCount * 3.5 - posCount * 1.2);
      } else {
        sentiment = 'Neutral';
        confidence = 78.5;
      }
    }

    const detectedAspects = extractAspects(textLower, sentiment, confidence);

    const result = {
      id: 'pred_' + Date.now(),
      reviewText: textTrimmed,
      productName: productName,
      sentiment: sentiment,
      confidence: parseFloat(confidence.toFixed(1)),
      confidenceBreakdown: confidenceBreakdown,
      aspects: detectedAspects,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    predictionService.saveToHistory(result);
    return result;
  },

  predictBatch: async (reviewsList) => {
    if (!reviewsList || !reviewsList.length) return [];

    const stringList = reviewsList.map(item => typeof item === 'string' ? item : item.text);

    try {
      // Direct batch endpoint call to FastAPI
      const res = await api.post('/predict/batch', { reviews: stringList });
      const apiResults = res.data.results || [];

      return apiResults.map((item, idx) => {
        const rawSentiment = item.sentiment || 'neutral';
        const sentiment = rawSentiment.charAt(0).toUpperCase() + rawSentiment.slice(1).toLowerCase();
        let confidence = 85.0;
        if (item.confidence && typeof item.confidence === 'object') {
          confidence = Math.max(...Object.values(item.confidence));
        }

        const originalText = stringList[idx];
        const productName = typeof reviewsList[idx] === 'object' && reviewsList[idx]?.productName 
          ? reviewsList[idx].productName 
          : 'Batch Flipkart Review';

        return {
          id: 'pred_' + Date.now() + '_' + idx,
          reviewText: originalText,
          productName: productName,
          sentiment: sentiment,
          confidence: parseFloat(confidence.toFixed(1)),
          aspects: extractAspects(originalText.toLowerCase(), sentiment, confidence),
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
      });
    } catch (err) {
      console.warn('[Batch Fallback] Calling predictSingle in sequence:', err.message);
      const results = [];
      for (let i = 0; i < reviewsList.length; i++) {
        const item = reviewsList[i];
        const text = typeof item === 'string' ? item : item.text;
        const prod = typeof item === 'string' ? 'Batch Upload Review' : (item.productName || 'Batch Item');
        const pred = await predictionService.predictSingle(text, prod);
        results.push(pred);
      }
      return results;
    }
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
