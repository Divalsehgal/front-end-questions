import { 
  Database, 
  Trash2, 
  Search, 
  HardDrive,
  ImagePlus,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { 
  getAllImages, 
  storeImage, 
  deleteImage, 
  clearAllImages, 
  CachedImage 
} from './utils/db';
import ImageCard from './components/ImageCard';
import { cn } from "../../utils/cn";

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
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="header space-y-2 text-center md:text-left">
        <h2 className="text-3xl font-black text-text-main flex items-center gap-2 tracking-tighter uppercase justify-center md:justify-start">
          <Database className="w-8 h-8 text-brand-500" />
          Binary Cache Engine
        </h2>
        <p className="text-sm font-medium text-text-muted max-w-lg">
          Master Browser Storage by caching binary data locally using <span className="text-brand-500 font-black">IndexedDB</span> for persistent offline access.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-muted p-1 rounded-3xl border border-subtle shadow-soft transition-all focus-within:ring-4 focus-within:ring-brand-500/10">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-muted/30 group-focus-within:text-brand-500 transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)} 
                placeholder="Enter External Image URL..."
                className="w-full pl-12 pr-4 py-4 bg-transparent outline-none text-text-main font-medium placeholder:text-text-muted/20"
              />
            </div>
            <button 
              className={cn(
                "px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-text-inverted transition-all active:scale-95 flex items-center justify-center gap-2 md:w-auto w-full",
                loading ? "bg-muted text-text-muted" : "bg-brand-500 hover:bg-brand-600 shadow-hard shadow-brand-500/10"
              )}
              onClick={handleDownloadAndCache}
              disabled={loading}
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <ImagePlus className="w-5 h-5" />
              )}
              {loading ? 'Processing...' : 'Sync & Cache'}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="flex items-center gap-2 p-4 bg-error-500/5 border border-error-500/10 rounded-2xl text-error-500 text-tiny font-black uppercase tracking-widest animate-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
            <span className="text-tiny font-black text-text-muted uppercase tracking-widest">
              {images.length} Objects Stored
            </span>
          </div>
          {images.length > 0 && (
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-error-500/10 hover:bg-error-500 text-error-500 hover:text-text-inverted text-tiny font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 group"
              onClick={handleClear}
            >
              <Trash2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              Purge System
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.length === 0 ? (
          <div className="col-span-full py-20 bg-muted/50 border-2 border-dashed border-subtle rounded-[3rem] flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-6 bg-surface rounded-full border border-subtle shadow-soft">
              <HardDrive className="w-12 h-12 text-text-muted/20" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-black text-text-main uppercase tracking-tighter">Storage Empty</p>
              <p className="text-sm font-medium text-text-muted max-w-xs">No images detected in local IndexedDB repository. Paste a URL to begin synchronization.</p>
            </div>
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
