import { MOCK_ANALYTICS } from './mockData';

export const analyticsService = {
  getAnalyticsData: async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return MOCK_ANALYTICS;
  }
};
