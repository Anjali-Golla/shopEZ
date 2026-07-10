import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryCard.css';

const CategoryCard = ({ name, icon: Icon, image, path }) => {
  return (
    <Link to={path} className="category-card">
      <div className="category-image-wrapper">
        <img src={image} alt={name} loading="lazy" />
        <div className="category-overlay"></div>
      </div>
      <div className="category-details">
        <div className="category-icon-circle">
          {Icon && <Icon className="category-icon" />}
        </div>
        <h3>{name}</h3>
        <span className="category-cta">Explore Now</span>
      </div>
    </Link>
  );
};

export default React.memo(CategoryCard);
