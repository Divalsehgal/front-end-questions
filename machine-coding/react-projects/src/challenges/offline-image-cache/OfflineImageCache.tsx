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
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div className="header space-y-2 text-center md:text-left">
        <h2 className="flex items-center justify-center gap-2 text-3xl font-black tracking-tighter text-text-main uppercase md:justify-start">
          <Database className="size-8 text-brand-500" />
          Binary Cache Engine
        </h2>
        <p className="max-w-lg text-sm font-medium text-text-muted">
          Master Browser Storage by caching binary data locally using <span className="font-black text-brand-500">IndexedDB</span> for persistent offline access.
        </p>
      </div>

      <div className="space-y-6">
        <div className="border-subtle rounded-3xl border bg-muted p-1 shadow-soft transition-all focus-within:ring-4 focus-within:ring-brand-500/10">
          <div className="flex flex-col gap-2 md:flex-row">
            <div className="group relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-text-muted/30 transition-colors group-focus-within:text-brand-500">
                <Search className="size-5" />
              </div>
              <input 
                type="text" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)} 
                placeholder="Enter External Image URL..."
                className="w-full bg-transparent py-4 pr-4 pl-12 font-medium text-text-main outline-none placeholder:text-text-muted/20"
              />
            </div>
            <button 
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-4 font-black tracking-widest text-text-inverted uppercase transition-all active:scale-95 md:w-auto",
                loading ? "bg-muted text-text-muted" : "bg-brand-500 shadow-hard shadow-brand-500/10 hover:bg-brand-600"
              )}
              onClick={handleDownloadAndCache}
              disabled={loading}
            >
              {loading ? (
                <RefreshCw className="size-5 animate-spin" />
              ) : (
                <ImagePlus className="size-5" />
              )}
              {loading ? 'Processing...' : 'Sync & Cache'}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-error-500/5 border-error-500/10 text-error-500 text-tiny animate-in slide-in-from-top-1 flex items-center gap-2 rounded-2xl border p-4 font-black tracking-widest uppercase">
            <AlertCircle className="size-4" />
            {error}
          </div>
        )}

        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="bg-success-500 size-2 animate-pulse rounded-full" />
            <span className="text-tiny font-black tracking-widest text-text-muted uppercase">
              {images.length} Objects Stored
            </span>
          </div>
          {images.length > 0 && (
            <button 
              className="bg-error-500/10 hover:bg-error-500 text-error-500 text-tiny group flex items-center gap-2 rounded-xl px-4 py-2 font-black tracking-widest uppercase transition-all hover:text-text-inverted active:scale-95"
              onClick={handleClear}
            >
              <Trash2 className="size-4 transition-transform group-hover:rotate-12" />
              Purge System
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {images.length === 0 ? (
          <div className="border-subtle col-span-full flex flex-col items-center justify-center space-y-4 rounded-[3rem] border-2 border-dashed bg-muted/50 py-20 text-center">
            <div className="border-subtle rounded-full border bg-surface p-6 shadow-soft">
              <HardDrive className="size-12 text-text-muted/20" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-black tracking-tighter text-text-main uppercase">Storage Empty</p>
              <p className="max-w-xs text-sm font-medium text-text-muted">No images detected in local IndexedDB repository. Paste a URL to begin synchronization.</p>
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
