import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryCard.css';

const CategoryCard = ({ name, icon: Icon, image, path }) => {
  // Category-specific high-quality fallback background images from Unsplash
  const fallbackImages = {
    'electronics': 'https://placehold.co/600x400/eeeeee/999999?text=Product+Image',
    'fashion': 'https://placehold.co/600x400/eeeeee/999999?text=Product+Image',
    'home & kitchen': 'https://placehold.co/600x400/eeeeee/999999?text=Product+Image',
    'beauty': 'https://placehold.co/600x400/eeeeee/999999?text=Product+Image',
    'sports': 'https://placehold.co/600x400/eeeeee/999999?text=Product+Image',
    'books': 'https://placehold.co/600x400/eeeeee/999999?text=Product+Image',
    'accessories': 'https://placehold.co/600x400/eeeeee/999999?text=Product+Image',
  };

  const nameKey = String(name).toLowerCase().trim();
  const bgImage = image || fallbackImages[nameKey] || 'https://placehold.co/600x400/eeeeee/999999?text=Product+Image';

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
