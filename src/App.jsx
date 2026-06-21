import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router';
import axios from 'axios';
import Navbar from './components/Navbar.jsx';
import CategoryButtons from './components/CategoryButtons';
import ProductCard from './components/ProductCard';


import './App.css';

const API_BASE = "http://localhost:5000/api/v1/products";

const CATEGORY_IMAGES = {
  'Books': [
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80'
  ],
  'Clothing': [
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?auto=format&fit=crop&w=600&q=80'
  ],
  'Electronics': [
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80'
  ],
  'Home & Kitchen': [
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
  ],
  'Sports': [
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80'
  ],
  'Toys': [
    'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1535572290543-960a8976f6af?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?auto=format&fit=crop&w=600&q=80'
  ]
};

const enrichProduct = (product) => {
  const list = CATEGORY_IMAGES[product.category] || CATEGORY_IMAGES['Electronics'];
  const hash = product._id ? parseInt(product._id.slice(-4), 16) : 0;
  const index = isNaN(hash) ? 0 : hash % list.length;

  const gallery = [
    list[index],
    list[(index + 1) % list.length],
    list[(index + 2) % list.length]
  ];

  return {
    ...product,
    image: gallery[0],
    gallery: gallery,
    originalPrice: Math.round(product.price * 1.3)
  };
};

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [products, setProducts] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch unique categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE}/categories`);
        if (res.data && res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async (category, cursor = null, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const params = { limit: 24 };
      if (category !== 'All Categories') {
        params.category = category;
      }
      if (cursor) {
        params.lastCreatedAt = cursor.createdAt;
        params.lastId = cursor.id;
      }

      const res = await axios.get(`${API_BASE}/all`, { params });
      if (res.data && res.data.success) {
        const enriched = res.data.products.map(enrichProduct);
        if (append) {
          setProducts(prev => [...prev, ...enriched]);
        } else {
          setProducts(enriched);
        }
        setNextCursor(res.data.nextCursor);
        setHasMore(res.data.hasMore);
      }
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Fetch first page on category change
  useEffect(() => {
    fetchProducts(activeCategory, null, false);
  }, [activeCategory, fetchProducts]);

  const handleViewMore = () => {
    if (nextCursor && hasMore && !loadingMore) {
      fetchProducts(activeCategory, nextCursor, true);
    }
  };

  const handleRefresh = () => {
    fetchProducts(activeCategory, null, false);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
      <Navbar />
      <CategoryButtons
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <div className="text-center mt-6 mb-10 px-4">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">MyStore Catalog</h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Explore over 200,000 premium products. Sorted by newest additions first.
        </p>
        <button
          onClick={handleRefresh}
          className="mt-4 inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:text-black hover:border-black px-4 py-2 rounded-full text-xs font-semibold shadow-sm transition-all cursor-pointer hover:shadow-md"
        >
          <span className="text-emerald-500 font-bold animate-ping text-[8px] mr-1">●</span>
          <span>Refresh Catalog</span>
        </button>
      </div>

      <main className="max-w-[95%] md:max-w-[80%] mx-auto px-2 flex-grow">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading catalog...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {products.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
            {products.length === 0 && (
              <div className="text-center py-20 text-gray-500 font-bold">
                No products available in this category.
              </div>
            )}

            {hasMore && (
              <div className="mt-12 mb-8 flex justify-center">
                <button
                  onClick={handleViewMore}
                  disabled={loadingMore}
                  className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors shadow-md disabled:bg-gray-400 cursor-pointer"
                >
                  {loadingMore ? 'Loading more...' : 'View More'}
                </button>
              </div>
            )}
          </>
        )}
      </main>


      <footer className="text-center mt-12 py-10 bg-black text-white w-full">
        <p className='text-sm text-gray-400'>© 2026 MyStore. Powered by high-speed Keyset Pagination.</p>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default App;