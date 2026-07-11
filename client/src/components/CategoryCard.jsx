import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryCard.css';

const CategoryCard = ({ name, icon: Icon, image, path }) => {
  // Category-specific high-quality fallback background images from Unsplash
  const fallbackImages = {
    'electronics': 'https://m.media-amazon.com/images/I/71jG+e7roXL._AC_SL1500_.jpg',
    'fashion': 'https://m.media-amazon.com/images/I/71jG+e7roXL._AC_SL1500_.jpg',
    'home & kitchen': 'https://m.media-amazon.com/images/I/71jG+e7roXL._AC_SL1500_.jpg',
    'beauty': 'https://m.media-amazon.com/images/I/71jG+e7roXL._AC_SL1500_.jpg',
    'sports': 'https://m.media-amazon.com/images/I/71jG+e7roXL._AC_SL1500_.jpg',
    'books': 'https://m.media-amazon.com/images/I/71jG+e7roXL._AC_SL1500_.jpg',
    'accessories': 'https://m.media-amazon.com/images/I/71jG+e7roXL._AC_SL1500_.jpg',
  };

  const nameKey = String(name).toLowerCase().trim();
  const bgImage = image || fallbackImages[nameKey] || 'https://m.media-amazon.com/images/I/71jG+e7roXL._AC_SL1500_.jpg';

  return (
    <Link to={path} className="category-card">
      <div className="category-image-wrapper">
        <img src={bgImage} alt={name} loading="lazy" />
        <div className="category-overlay"></div>
      </div>
      <div className="category-details">
        <div className="category-icon-circle">
          {Icon && <Icon className="category-icon" />}
        </div>
        <h3 className="category-card-title">{name}</h3>
        <button className="category-cta-btn">Explore Now</button>
      </div>
    </Link>
  );
};

export default React.memo(CategoryCard);
