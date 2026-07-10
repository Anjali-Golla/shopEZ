import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryCard.css';

const CategoryCard = ({ name, icon: Icon, image, path }) => {
  // Category-specific high-quality fallback background images from Unsplash
  const fallbackImages = {
    'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&auto=format&fit=crop&q=60',
    'fashion': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&auto=format&fit=crop&q=60',
    'home & kitchen': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&auto=format&fit=crop&q=60',
    'beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&auto=format&fit=crop&q=60',
    'sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&auto=format&fit=crop&q=60',
    'books': 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&auto=format&fit=crop&q=60',
    'accessories': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=60',
  };

  const nameKey = String(name).toLowerCase().trim();
  const bgImage = image || fallbackImages[nameKey] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&auto=format&fit=crop&q=60';

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
