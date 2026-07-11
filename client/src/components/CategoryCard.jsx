import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryCard.css';

const CategoryCard = ({ name, icon: Icon, path }) => {
  // Stunning modern gradients for different categories to completely replace buggy external images
  const categoryGradients = {
    'electronics': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', // Blue to Purple
    'mobiles': 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
    'laptops': 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    'fashion': 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)', // Pink to Rose
    "women's fashion": 'linear-gradient(135deg, #f472b6 0%, #e11d48 100%)',
    "men's fashion": 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
    'footwear': 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)', // Orange
    'home & kitchen': 'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Emerald
    'beauty': 'linear-gradient(135deg, #f472b6 0%, #db2777 100%)',
    'watches': 'linear-gradient(135deg, #94a3b8 0%, #475569 100%)',
    'sports': 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)', // Cyan
    'accessories': 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
    'kids wear': 'linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)',
    'bags': 'linear-gradient(135deg, #fb7185 0%, #e11d48 100%)',
    'books': 'linear-gradient(135deg, #6ee7b7 0%, #059669 100%)',
    'gaming': 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
  };

  const nameKey = String(name).toLowerCase().trim();
  // Fallback to a sleek dark gradient if category isn't mapped
  const bgGradient = categoryGradients[nameKey] || 'linear-gradient(135deg, #334155 0%, #0f172a 100%)';

  return (
    <Link to={path} className="category-card">
      <div className="category-gradient-bg" style={{ background: bgGradient }}>
        {/* Subtle overlay pattern/noise for premium feel can go here */}
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
