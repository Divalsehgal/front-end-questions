import React, { useEffect, useState } from 'react';
import { CachedImage } from '../utils/db';
import { Trash2, Calendar, Clock, Image as ImageIcon } from 'lucide-react';

interface ImageCardProps {
  image: CachedImage;
  onRemove: (id: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onRemove }) => {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(image.blob);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image.blob]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="group bg-surface rounded-3xl border border-subtle shadow-soft overflow-hidden hover:shadow-hard transition-all duration-300 flex flex-col">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={imageUrl} 
          alt={image.name} 
          loading="lazy" 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <div className="px-2 py-1 bg-surface/80 backdrop-blur-md border border-subtle rounded-lg flex items-center gap-1.5 shadow-soft">
            <ImageIcon className="w-3 h-3 text-brand-500" />
            <span className="text-[10px] font-black text-text-main uppercase tracking-widest">Cached</span>
          </div>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1 gap-4">
        <div className="space-y-3">
          <h3 className="text-sm font-black text-text-main truncate uppercase tracking-tight">
            {image.name}
          </h3>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 text-tiny font-black text-text-muted/50 uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(image.timestamp)}
            </div>
            <div className="flex items-center gap-1.5 text-tiny font-black text-text-muted/50 uppercase tracking-widest">
              <Clock className="w-3.5 h-3.5" />
              {formatTime(image.timestamp)}
            </div>
          </div>
        </div>
        <div className="pt-4 border-t border-subtle mt-auto flex items-center justify-between">
          <span className="text-tiny font-black text-brand-500 uppercase tracking-widest">System Object</span>
          <button 
            className="p-2 bg-error-500/10 hover:bg-error-500 text-error-500 hover:text-text-inverted rounded-xl transition-all active:scale-95" 
            onClick={() => onRemove(image.id)}
            title="Remove from binary repository"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
