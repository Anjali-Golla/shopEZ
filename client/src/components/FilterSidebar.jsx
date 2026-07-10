import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import './FilterSidebar.css';
import { formatPrice } from '../utils/priceFormatter';

const FilterSidebar = ({
  selectedCategories,
  onCategoryToggle,
  selectedBrands,
  onBrandToggle,
  maxPrice,
  onPriceChange,
  selectedRating,
  onRatingSelect,
  inStockOnly,
  onStockToggle,
  discountOnly,
  onDiscountToggle,
  onClearFilters,
  categoriesList,
  brandsList,
}) => {
  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <h3>Filters</h3>
        <button onClick={onClearFilters} className="clear-filters-btn">
          Clear All
        </button>
      </div>

      {/* 1. Category Filter */}
      <div className="filter-group">
        <h4>Category</h4>
        <div className="filter-options">
          {categoriesList.map((cat) => (
            <label key={cat.id} className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.name)}
                onChange={() => onCategoryToggle(cat.name)}
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 2. Brand Filter */}
      <div className="filter-group">
        <h4>Brand</h4>
        <div className="filter-options">
          {brandsList.map((brand) => (
            <label key={brand} className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => onBrandToggle(brand)}
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Price Slider Filter */}
      <div className="filter-group">
        <h4>Price Range</h4>
        <div className="price-slider-container">
          <input
            type="range"
            min="0"
            max="300000"
            step="1000"
            value={maxPrice}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            className="price-slider"
          />
          <div className="price-values">
            <span>{formatPrice(0)}</span>
            <span className="current-price-val">Up to {formatPrice(maxPrice)}</span>
            <span>{formatPrice(300000)}</span>
          </div>
        </div>
      </div>

      {/* 4. Rating Filter */}
      <div className="filter-group">
        <h4>Rating</h4>
        <div className="rating-filter-options">
          {[4, 3, 2].map((stars) => (
            <button
              key={stars}
              onClick={() => onRatingSelect(stars)}
              className={`rating-filter-btn ${selectedRating === stars ? 'active' : ''}`}
            >
              <div className="stars-row">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>
                    {star <= stars ? <FaStar className="star" /> : <FaRegStar className="empty-star" />}
                  </span>
                ))}
              </div>
              <span>& Up</span>
            </button>
          ))}
          <button
            onClick={() => onRatingSelect(0)}
            className={`rating-filter-btn ${selectedRating === 0 ? 'active' : ''}`}
          >
            All Ratings
          </button>
        </div>
      </div>

      {/* 5. Availability Filter */}
      <div className="filter-group">
        <h4>Availability</h4>
        <label className="filter-checkbox-label">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={onStockToggle}
          />
          <span>In Stock Only</span>
        </label>
      </div>

      {/* 6. Discount Filter */}
      <div className="filter-group">
        <h4>Offers</h4>
        <label className="filter-checkbox-label">
          <input
            type="checkbox"
            checked={discountOnly}
            onChange={onDiscountToggle}
          />
          <span>Discounted Products Only</span>
        </label>
      </div>
    </aside>
  );
};

export default React.memo(FilterSidebar);
