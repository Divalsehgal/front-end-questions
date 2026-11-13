import { useEffect, useState } from 'react';

// ---- IndexedDB helpers: each one wraps an IDBRequest in a Promise ----
const DB_NAME = 'ImageCacheDB';
const STORE_NAME = 'images';

interface CachedImage {
  id: string;
  blob: Blob;
  name: string;
  timestamp: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    // Runs the first time (or when the version goes up): create the store.
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function runRequest<T>(mode: IDBTransactionMode, makeRequest: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const store = db.transaction(STORE_NAME, mode).objectStore(STORE_NAME);
    const request = makeRequest(store);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

const storeImage = (image: CachedImage) => runRequest('readwrite', (store) => store.put(image));
const getAllImages = () => runRequest<CachedImage[]>('readonly', (store) => store.getAll());
const deleteImage = (id: string) => runRequest('readwrite', (store) => store.delete(id));
const clearImages = () => runRequest('readwrite', (store) => store.clear());

// ---- UI ----

// Each card makes an object URL for its Blob and revokes it on unmount, so memory is freed.
function ImageCard({ image, onDelete }: { image: CachedImage; onDelete: (id: string) => void }) {
  const [src, setSrc] = useState('');

  useEffect(() => {
    const url = URL.createObjectURL(image.blob);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [image.blob]);

  return (
    <li className="overflow-hidden rounded-lg border border-border-subtle bg-surface">
      {src && <img src={src} alt={image.name} className="aspect-video w-full object-cover" />}
      <div className="flex items-center justify-between p-2">
        <span className="text-sm text-text-main">{image.name}</span>
        <button onClick={() => onDelete(image.id)} className="text-sm text-error">
          Delete
        </button>
      </div>
    </li>
  );
}

export default function OfflineImageCache() {
  const [images, setImages] = useState<CachedImage[]>([]);
  const [url, setUrl] = useState('https://picsum.photos/400/225');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState('');

  const updateUsage = async () => {
    // Not every browser (or sandboxed iframe) allows navigator.storage.estimate.
    try {
      const { usage = 0, quota = 0 } = await navigator.storage.estimate();
      setUsage(`${(usage / 1024 / 1024).toFixed(1)} MB of ${(quota / 1024 / 1024).toFixed(0)} MB used`);
    } catch {
      setUsage('');
    }
  };

  // Load what was saved before (this is what makes it work after a reload or offline).
  useEffect(() => {
    getAllImages()
      .then((saved) => setImages(saved))
      .catch(() => setError('Could not read saved images'))
      .finally(() => setLoading(false));
    updateUsage();
  }, []);

  const addImage = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const image: CachedImage = { id: crypto.randomUUID(), blob, name: `Image ${images.length + 1}`, timestamp: Date.now() };
      await storeImage(image);
      setImages((prev) => [...prev, image]);
      updateUsage();
    } catch (err) {
      setError(`Could not save image: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = async (id: string) => {
    try {
      await deleteImage(id);
      setImages((prev) => prev.filter((image) => image.id !== id));
      updateUsage();
    } catch {
      setError('Could not delete image');
    }
  };

  const removeAll = async () => {
    try {
      await clearImages();
      setImages([]);
      updateUsage();
    } catch {
      setError('Could not clear images');
    }
  };

  const visible = images.filter((image) => image.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6">
      <h2 className="text-xl font-bold text-text-main">Offline image cache</h2>

      <div className="flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          aria-label="Image URL"
          className="flex-1 rounded-lg border border-border-subtle bg-surface px-3 py-2 text-text-main"
        />
        <button onClick={addImage} disabled={loading} className="rounded-lg bg-brand-500 px-4 py-2 font-semibold text-text-inverted disabled:opacity-50">
          Add image
        </button>
      </div>

      <div className="flex items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name"
          className="flex-1 rounded-lg border border-border-subtle bg-surface px-3 py-2 text-text-main"
        />
        <button onClick={removeAll} disabled={images.length === 0} className="rounded-lg border border-border-subtle px-3 py-2 text-error disabled:opacity-40">
          Clear all
        </button>
      </div>

      {usage && <p className="text-sm text-text-muted">{usage}</p>}
      {loading && <p className="text-text-muted">Loading...</p>}
      {error && <p className="text-error">{error}</p>}
      {!loading && images.length === 0 && <p className="text-text-muted">No images yet.</p>}

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {visible.map((image) => (
          <ImageCard key={image.id} image={image} onDelete={removeImage} />
        ))}
      </ul>
    </div>
  );
}
