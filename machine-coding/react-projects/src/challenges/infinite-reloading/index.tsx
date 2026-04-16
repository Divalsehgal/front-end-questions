import React, { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "../../utils/cn";
import { 
  Users, 
  Loader2, 
  Mail, 
  ArrowUp, 
  Hash, 
  Activity,
  User as UserIcon
} from "lucide-react";

export const hint = "Dynamic infinite scroll implementation using IntersectionObserver with API integration";

interface User {
  id: string;
  name: { first: string; last: string };
  email: string;
  picture: { thumbnail: string; large: string };
  location: { country: string };
}

export default function InfiniteReloading() {
  const [items, setItems] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://randomuser.me/api/?page=${page}&results=20&seed=antigravity`);
      const data = await response.json();
      const newUsers = data.results.map((u: any) => ({
        id: u.login.uuid,
        name: u.name,
        email: u.email,
        picture: u.picture,
        location: u.location
      }));
      
      setItems(prev => [...prev, ...newUsers]);
      setHasMore(page < 10); // Limit to 10 pages for demo
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between sticky top-0 py-4 bg-surface-50/80 dark:bg-surface-900/80 backdrop-blur-xl z-20 -mx-6 px-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
            <Activity className="w-7 h-7 text-brand-500" />
            INFINITE FLOW
          </h2>
          <p className="text-sm font-medium text-gray-500">
            Real-time population stream.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Total Loaded</span>
             <span className="text-lg font-black text-brand-500 leading-none mt-1">{items.length}</span>
          </div>
          <button 
            onClick={scrollToTop}
            className="p-3 bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700 rounded-2xl border border-surface-200 dark:border-surface-700 transition-all shadow-sm group"
          >
            <ArrowUp className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map((user, index) => {
          if (items.length === index + 1) {
            return (
              <div ref={lastElementRef} key={user.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <UserCard user={user} index={index + 1} />
              </div>
            );
          }
          return (
            <div key={user.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <UserCard user={user} index={index + 1} />
            </div>
          );
        })}
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" />
            <Loader2 className="w-6 h-6 text-brand-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-sm font-bold text-brand-600 dark:text-brand-400 uppercase tracking-[0.2em] animate-pulse">Syncing Population...</p>
        </div>
      )}

      {!hasMore && (
        <div className="p-12 text-center border-2 border-dashed border-surface-200 dark:border-surface-800 rounded-[2.5rem] bg-surface-50 dark:bg-surface-900/50">
          <Hash className="w-10 h-10 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tight">Stream Exhausted</h4>
          <p className="text-sm text-gray-500">You've reached the end of this digital population.</p>
        </div>
      )}
    </div>
  );
}

function UserCard({ user, index }: { user: User; index: number }) {
  return (
    <div className="group bg-white dark:bg-surface-800 border-2 border-surface-100 dark:border-surface-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-5 hover:border-brand-500/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative">
      {/* Index Badge */}
      <div className="absolute -top-1 -right-1 w-12 h-12 bg-surface-50 dark:bg-surface-900 group-hover:bg-brand-500 flex items-end justify-start p-2 rotate-45 group-hover:rotate-0 transition-all rounded-bl-3xl">
        <span className="text-[10px] font-black text-gray-400 group-hover:text-white tracking-widest mt-1">
          #{index}
        </span>
      </div>

      <div className="flex items-center gap-4 sm:gap-6 relative z-10">
        <div className="relative shrink-0">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-brand-100 p-0.5 group-hover:rotate-6 transition-transform">
            <img 
              src={user.picture.large} 
              className="w-full h-full object-cover rounded-[inherit]" 
              alt={user.name.first} 
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-surface-800 rounded-full" />
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="text-base sm:text-xl font-black text-gray-900 dark:text-white truncate tracking-tight">
            {user.name.first} {user.name.last}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-gray-500 group-hover:text-brand-500 transition-colors">
              <Mail className="w-3 h-3" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-gray-400">
              <span className="bg-surface-100 dark:bg-surface-900 px-1.5 py-0.5 rounded-md uppercase tracking-tight text-[8px]">
                {user.location.country}
              </span>
            </div>
          </div>
        </div>

        <button className="hidden sm:flex opacity-0 group-hover:opacity-100 items-center justify-center p-3 bg-brand-50 dark:bg-brand-900/20 text-brand-500 rounded-2xl transition-all hover:bg-brand-500 hover:text-white">
          <UserIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
