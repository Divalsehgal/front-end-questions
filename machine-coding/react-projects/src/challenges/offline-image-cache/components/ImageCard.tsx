import React, { useEffect, useState } from 'react';
import { CachedImage } from '../utils/db';

interface ImageCardProps {
  image: CachedImage;
  onRemove: (id: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onRemove }) => {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    // Create a local URL for the Blob
    const url = URL.createObjectURL(image.blob);
    setImageUrl(url);

    // Clean up to prevent memory leaks
    return () => URL.revokeObjectURL(url);
  }, [image.blob]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="image-card">
      <div className="image-wrapper">
        <img src={imageUrl} alt={image.name} loading="lazy" />
      </div>
      <div className="card-content">
        <div className="image-info">
          <span className="image-name">{image.name}</span>
          <span className="image-meta">{formatDate(image.timestamp)}</span>
          <span className="status-badge">Cached</span>
        </div>
        <button 
          className="btn btn-danger" 
          onClick={() => onRemove(image.id)}
          title="Remove from cache"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ImageCard;
