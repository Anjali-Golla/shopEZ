import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import { ProductCardSkeleton } from '../components/Skeletons';
import { categories } from '../utils/mockData';
import './Products.css';

const Products = () => {
  const { search } = useLocation();

  // 1. Data Loading State
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesList, setCategoriesList] = useState([]);
  const [allBrands, setAllBrands] = useState([]);

  // 2. Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [maxPrice, setMaxPrice] = useState(300000);
  const [selectedRating, setSelectedRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [discountOnly, setDiscountOnly] = useState(false);
  
  // 3. Search & Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('best-selling');
  
  // 4. Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch categories dynamically from database API on mount
  useEffect(() => {
    document.title = 'Browse Products | ShopEz';
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/categories');
        setCategoriesList(res.data || []);
      } catch (err) {
        console.error('Failed to load categories list', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch unique brands list dynamically once from full database products catalog
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get('/api/products?limit=1000');
        const brands = [...new Set((res.data.products || []).map((p) => p.brand))];
        setAllBrands(brands);
      } catch (err) {
        console.error('Failed to load brands list', err);
      }
    };
    fetchBrands();
  }, []);

  // Dynamic products query handler triggered on any filter change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        const params = new URLSearchParams();
        
        if (searchQuery.trim()) {
          params.append('search', searchQuery.trim());
        }
        
        if (selectedCategories.length > 0) {
          params.append('category', selectedCategories[0]);
        }
        
        if (selectedBrands.length > 0) {
          params.append('brand', selectedBrands[0]);
        }
        
        if (maxPrice) {
          params.append('maxPrice', maxPrice);
        }
        
        if (selectedRating > 0) {
          params.append('rating', selectedRating);
        }
        
        if (inStockOnly) {
          params.append('stock', 'inStock');
        }
        
        if (sortBy) {
          params.append('sort', sortBy);
        }
        
        params.append('page', currentPage);
        params.append('limit', 6); // 6 products per page

        const res = await axios.get(`/api/products?${params.toString()}`);
        setProductsList(res.data.products || []);
        setTotalPages(res.data.pages || 1);
        setTotalProducts(res.data.totalProducts || 0);
        setLoading(false);
      } catch (error) {
        console.error('Failed to query products from database', error);
        setLoading(false);
      }
    };

    setLoading(true);
    fetchFilteredProducts();

    // 10-second real-time polling
    const pollInterval = setInterval(fetchFilteredProducts, 10000);

    // Event-driven instant updates
    window.addEventListener('product-updated', fetchFilteredProducts);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('product-updated', fetchFilteredProducts);
    };
  }, [searchQuery, selectedCategories, selectedBrands, maxPrice, selectedRating, inStockOnly, sortBy, currentPage]);

  // Sync category and search filters from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(search);
    const searchParam = params.get('search');
    const catParam = params.get('category');

    if (searchParam) {
      setSearchQuery(searchParam);
    } else {
      setSearchQuery('');
    }

    if (catParam && categoriesList.length > 0) {
      const targetNorm = catParam.toLowerCase().replace(/['’\s_-]/g, '');
      const matchedCat = categoriesList.find((c) => {
        const nameNorm = c.name.toLowerCase().replace(/['’\s_-]/g, '');
        const slugNorm = (c.slug || '').toLowerCase().replace(/['’\s_-]/g, '');
        return nameNorm === targetNorm || slugNorm === targetNorm;
      });
      if (matchedCat) {
        setSelectedCategories([matchedCat.name]);
      } else {
        setSelectedCategories([]);
      }
    } else if (!catParam) {
      setSelectedCategories([]);
    }
  }, [search, categoriesList]);

  // Update document title dynamically based on category selection
  useEffect(() => {
    if (selectedCategories.length === 1) {
      document.title = `${selectedCategories[0]} - ShopEZ`;
    } else {
      document.title = 'Premium Catalog - ShopEZ';
    }
  }, [selectedCategories]);

  // Reset pagination page when any filter shifts
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, selectedBrands, maxPrice, selectedRating, inStockOnly, discountOnly, searchQuery, sortBy]);

  // Handle sidebar action clicks
  const handleCategoryToggle = useCallback((catName) => {
    setSelectedCategories((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [...prev, catName]
    );
  }, []);

  const handleBrandToggle = useCallback((brandName) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName) ? prev.filter((b) => b !== brandName) : [...prev, brandName]
    );
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMaxPrice(300000);
    setSelectedRating(0);
    setInStockOnly(false);
    setDiscountOnly(false);
    setSearchQuery('');
    setSortBy('best-selling');
  }, []);

  return (
    <div className="products-page-container">
      {/* Sidebar Filters */}
      <div className="products-sidebar-wrap">
        <FilterSidebar
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
          selectedBrands={selectedBrands}
          onBrandToggle={handleBrandToggle}
          maxPrice={maxPrice}
          onPriceChange={setMaxPrice}
          selectedRating={selectedRating}
          onRatingSelect={setSelectedRating}
          inStockOnly={inStockOnly}
          onStockToggle={() => setInStockOnly(!inStockOnly)}
          discountOnly={discountOnly}
          onDiscountToggle={() => setDiscountOnly(!discountOnly)}
          onClearFilters={handleClearFilters}
          categoriesList={categoriesList}
          brandsList={allBrands}
        />
      </div>

      {/* Main Catalog View */}
      <div className="products-main-content">
        {/* Top Control Bar */}
        <div className="products-top-bar">
          <div className="top-search-wrap">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          <div className="top-info-wrap">
            <span className="product-count">
              Showing <strong>{totalProducts}</strong> products
            </span>

            <div className="sort-select-wrapper">
              <label htmlFor="sort-by">Sort By:</label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-dropdown"
              >
                <option value="best-selling">Best Selling</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="highest-rated">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="products-catalog-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : productsList.length > 0 ? (
          <div className="products-catalog-grid">
            {productsList.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-products-found">
            <h3>No Products Found</h3>
            <p>Try widening your search terms or clearing active sidebar filters.</p>
            <button onClick={handleClearFilters} className="btn btn-primary">
              Clear All Filters
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Products;
