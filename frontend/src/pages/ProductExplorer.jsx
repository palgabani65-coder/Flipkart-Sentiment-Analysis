import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Star, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { productService } from '../services/productService';
import { SentimentBadge } from '../components/common/SentimentBadge';
import { SkeletonCard } from '../components/common/SkeletonLoader';

export const ProductExplorer = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const selectedCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'popular';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    setCategories(productService.getCategories());
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, sortBy, page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getProducts({
        category: selectedCategory,
        search: searchQuery,
        sortBy: sortBy,
        page: page,
        limit: 6
      });
      setProducts(res.products);
      setTotalPages(res.totalPages);
      setTotalProducts(res.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateParam = (key, val) => {
    const newParams = new URLSearchParams(searchParams);
    if (val && val !== 'All' && val !== '1' && val !== '') {
      newParams.set(key, val);
    } else {
      newParams.delete(key);
    }
    if (key !== 'page') newParams.delete('page'); // reset to page 1 on filter change
    setSearchParams(newParams);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Flipkart Product Sentiment Catalog
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Browse e-commerce products with pre-analyzed customer review sentiment scores
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => updateParam('sortBy', e.target.value)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="popular">Most Popular</option>
            <option value="sentiment">Highest Positive Sentiment</option>
            <option value="rating">Highest Rating</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category Chips & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <Filter className="w-4 h-4 text-gray-400 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateParam('category', cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search catalog..."
            value={searchQuery}
            onChange={(e) => updateParam('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col justify-between group"
            >
              <div className="p-5 space-y-4">
                
                {/* Image & Discount Badge */}
                <div className="relative h-48 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-yellow-400 text-blue-950 font-bold text-[10px]">
                    {product.discount}
                  </span>
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-semibold text-[10px]">
                    {product.category}
                  </span>
                </div>

                {/* Title & Brand */}
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{product.brand}</span>
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 mt-0.5 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h2>
                </div>

                {/* Price & Rating */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-extrabold text-gray-900 dark:text-white">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                  </div>
                </div>

                {/* Sentiment Meter Bar */}
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-gray-500">Customer Sentiment</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {product.sentimentSummary.positive}% Positive
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 flex overflow-hidden">
                    <div style={{ width: `${product.sentimentSummary.positive}%` }} className="bg-emerald-500 h-full" />
                    <div style={{ width: `${product.sentimentSummary.neutral}%` }} className="bg-amber-400 h-full" />
                    <div style={{ width: `${product.sentimentSummary.negative}%` }} className="bg-rose-500 h-full" />
                  </div>
                </div>

              </div>

              {/* Card Footer Action */}
              <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                <Link
                  to={`/products/${product.id}`}
                  className="w-full py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-bold text-xs hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> View Sentiment Details
                </Link>
              </div>

            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-500">No products matching your search criteria.</p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            disabled={page <= 1}
            onClick={() => updateParam('page', (page - 1).toString())}
            className="p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => updateParam('page', (page + 1).toString())}
            className="p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
