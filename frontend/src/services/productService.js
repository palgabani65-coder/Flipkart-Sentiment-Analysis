import { MOCK_PRODUCTS, MOCK_REVIEWS } from './mockData';

export const productService = {
  getProducts: async ({ category = 'All', search = '', sortBy = 'popular', page = 1, limit = 6 } = {}) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filtered = [...MOCK_PRODUCTS];

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
  }
};
