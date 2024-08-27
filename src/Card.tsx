import React, { useState } from 'react';
import { Document } from './types';

interface CardProps {
  card: Document;
  onImageClick: (imageType: string) => void;
}

const Card: React.FC<CardProps> = ({ card, onImageClick }) => {
  const [loading, setLoading] = useState(true);
  return (
    <div className="card" onClick={() => onImageClick(card.type)}>
      {loading && <div className="spinner"></div>}
      <img
        src={`/${card.type}.png`}
        alt={card.title}
        width={100}
        height={100}
        onLoad={() => {console.log('loading', loading);setLoading(false)}}
        style={{ display: loading ? 'none' : 'block' }}
      />
      <h3>{card.title}</h3>
    </div>
  );
};

export default Card;
