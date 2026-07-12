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
    <div className="group border-subtle flex flex-col overflow-hidden rounded-3xl border bg-surface shadow-soft transition-all duration-300 hover:shadow-hard">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={imageUrl} 
          alt={image.name} 
          loading="lazy" 
          className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <div className="border-subtle flex items-center gap-1.5 rounded-lg border bg-surface/80 px-2 py-1 shadow-soft backdrop-blur-md">
            <ImageIcon className="size-3 text-brand-500" />
            <span className="text-[10px] font-black tracking-widest text-text-main uppercase">Cached</span>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-3">
          <h3 className="truncate text-sm font-black tracking-tight text-text-main uppercase">
            {image.name}
          </h3>
          <div className="flex flex-wrap gap-3">
            <div className="text-tiny flex items-center gap-1.5 font-black tracking-widest text-text-muted/50 uppercase">
              <Calendar className="size-3.5" />
              {formatDate(image.timestamp)}
            </div>
            <div className="text-tiny flex items-center gap-1.5 font-black tracking-widest text-text-muted/50 uppercase">
              <Clock className="size-3.5" />
              {formatTime(image.timestamp)}
            </div>
          </div>
        </div>
        <div className="border-subtle mt-auto flex items-center justify-between border-t pt-4">
          <span className="text-tiny font-black tracking-widest text-brand-500 uppercase">System Object</span>
          <button 
            className="bg-error-500/10 hover:bg-error-500 text-error-500 rounded-xl p-2 transition-all hover:text-text-inverted active:scale-95" 
            onClick={() => onRemove(image.id)}
            title="Remove from binary repository"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
