import React, { useState, useEffect } from 'react';
import { 
  getAllImages, 
  storeImage, 
  deleteImage, 
  clearAllImages, 
  CachedImage 
} from './utils/db';
import ImageCard from './components/ImageCard';
import './style.css';

const DEFAULT_IMAGE = 'https://picsum.photos/800/450';

const OfflineImageCache: React.FC = () => {
  const [url, setUrl] = useState<string>(DEFAULT_IMAGE);
  const [images, setImages] = useState<CachedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCachedImages();
  }, []);

  const loadCachedImages = async () => {
    try {
      const cached = await getAllImages();
      setImages(cached.sort((a, b) => b.timestamp - a.timestamp));
    } catch (err) {
      console.error('Failed to load images:', err);
    }
  };

  const handleDownloadAndCache = async () => {
    if (!url) return;
    
    setLoading(true);
    setError(null);

    try {
      // 1. Fetch the image
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch image');
      
      // 2. Convert to Blob
      const blob = await response.blob();
      
      // 3. Create cache object
      const newImage: CachedImage = {
        id: crypto.randomUUID(),
        blob: blob,
        name: `Image_${images.length + 1}`,
        timestamp: Date.now(),
      };

      // 4. Store in IndexedDB
      await storeImage(newImage);
      
      // 5. Update local state
      setImages(prev => [newImage, ...prev]);
      
      // Reset URL for next one
      setUrl(`https://picsum.photos/800/450?random=${Date.now()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await deleteImage(id);
      setImages(prev => prev.filter(img => img.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleClear = async () => {
    if (window.confirm('Clear all cached images?')) {
      await clearAllImages();
      setImages([]);
    }
  };

  return (
    <div className="offline-cache-container">
      <div className="header">
        <h1>Offline Image Cache</h1>
        <p>Master Browser Storage by caching binary data locally.</p>
      </div>

      <div className="controls">
        <div className="input-group">
          <input 
            type="text" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            placeholder="Enter Image URL..."
          />
          <button 
            className="btn btn-primary" 
            onClick={handleDownloadAndCache}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Download & Cache'}
          </button>
        </div>
        
        {error && <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>{error}</p>}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{images.length} Images Cached</span>
          {images.length > 0 && (
            <button className="btn btn-danger" onClick={handleClear}>
              Clear Cache
            </button>
          )}
        </div>
      </div>

      <div className="image-grid">
        {images.length === 0 ? (
          <div className="empty-state">
            No images in cache. Paste a URL above to start!
          </div>
        ) : (
          images.map(img => (
            <ImageCard 
              key={img.id} 
              image={img} 
              onRemove={handleRemove} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default OfflineImageCache;
