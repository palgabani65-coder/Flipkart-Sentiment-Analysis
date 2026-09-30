import { api } from './api';
import { MOCK_PRODUCTS, MOCK_REVIEWS } from './mockData';

export const productService = {
  getProducts: async ({ category = 'All', search = '', sortBy = 'popular', page = 1, limit = 6 } = {}) => {
    let baseList = [...MOCK_PRODUCTS];

    try {
      const res = await api.get('/products');
      if (res.data?.products?.length > 0) {
        const dbProducts = res.data.products.map((p, idx) => ({
          id: `db_prod_${idx + 1}`,
          name: p.product_name,
          brand: p.product_name.split(' ')[0] || 'Flipkart',
          category: 'Coolers & Home',
          price: p.avg_price || 4999,
          rating: p.avg_rating || 4.2,
          reviewsCount: p.total_reviews || 50,
          image: '📦',
          sentimentSummary: {
            positive: p.sentiment_score || 75,
            neutral: Math.round((p.neutral_count / (p.total_reviews || 1)) * 100),
            negative: Math.round((p.negative_count / (p.total_reviews || 1)) * 100),
          },
          sentimentScore: p.sentiment_score || 75
        }));
        // Merge catalog with DB products (catalog first for rich detail)
        baseList = [...MOCK_PRODUCTS, ...dbProducts];
      }
    } catch (e) {
      console.warn('[ProductService] Backend products unavailable, using local catalog:', e.message);
    }

    let filtered = baseList;

    if (category && category !== 'All') {
      filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'sentiment') {
      filtered.sort((a, b) => b.sentimentSummary.positive - a.sentimentSummary.positive);
    }

    const startIndex = (page - 1) * limit;
    const paginatedProducts = filtered.slice(startIndex, startIndex + limit);

    return {
      products: paginatedProducts,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
      currentPage: page
    };
  },

  getProductById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const product = MOCK_PRODUCTS.find((p) => p.id === id);
    if (!product) {
      throw new Error('Product not found.');
    }

    const reviews = MOCK_REVIEWS.filter((r) => r.productId === id || id === 'prod-001');
    return { ...product, reviews };
  },

  getCategories: () => {
    return ['All', 'Mobiles', 'Audio', 'Laptops', 'Fashion', 'Appliances'];
  },

  getLiveReviews: async ({ limit = 50, offset = 0, sentiment = 'all', search = '' } = {}) => {
    try {
      const res = await api.get('/reviews', {
        params: { limit, offset, sentiment, search }
      });
      return res.data;
    } catch (e) {
      console.warn('[ProductService] Live reviews API fallback:', e.message);
      return { total: 0, reviews: [] };
    }
  }
};
