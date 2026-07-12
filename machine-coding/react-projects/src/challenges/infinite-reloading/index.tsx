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
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      <div className="sticky top-0 z-20 -mx-6 flex items-center justify-between bg-canvas/80 px-6 py-4 backdrop-blur-xl">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight text-text-main">
            <Activity className="size-7 text-brand-500" />
            INFINITE FLOW
          </h2>
          <p className="text-sm font-medium text-text-muted">
            Real-time population stream.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden flex-col items-end sm:flex">
             <span className="text-tiny leading-none font-black tracking-widest text-text-muted uppercase">Total Loaded</span>
             <span className="mt-1 text-lg leading-none font-black text-brand-500">{items.length}</span>
          </div>
          <button 
            onClick={scrollToTop}
            className="border-subtle group rounded-2xl border bg-surface p-3 shadow-soft transition-all hover:bg-muted"
          >
            <ArrowUp className="size-5 text-text-muted transition-transform group-hover:-translate-y-1" />
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
        <div className="flex flex-col items-center justify-center space-y-4 p-12">
          <div className="relative">
            <div className="size-12 animate-spin rounded-full border-4 border-brand-500/20 border-t-brand-500" />
            <Loader2 className="absolute top-1/2 left-1/2 size-6 -translate-1/2 animate-pulse text-brand-500" />
          </div>
          <p className="animate-pulse text-sm font-bold tracking-[0.2em] text-brand-500 uppercase">Syncing Population...</p>
        </div>
      )}

      {!hasMore && (
        <div className="border-subtle rounded-3xl border-2 border-dashed bg-muted p-12 text-center">
          <Hash className="mx-auto mb-4 size-10 text-text-muted/20" />
          <h4 className="text-lg font-bold tracking-tight text-text-main uppercase">Stream Exhausted</h4>
          <p className="text-sm text-text-muted">You've reached the end of this digital population.</p>
        </div>
      )}
    </div>
  );
}

function UserCard({ user, index }: { user: User; index: number }) {
  return (
    <div className="group border-subtle relative overflow-hidden rounded-2xl border-2 bg-surface p-4 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-hard sm:rounded-3xl sm:p-5">
      {/* Index Badge */}
      <div className="absolute -top-1 -right-1 flex size-12 rotate-45 items-end justify-start rounded-bl-3xl bg-muted p-2 transition-all group-hover:rotate-0 group-hover:bg-brand-500">
        <span className="text-tiny mt-1 font-black tracking-widest text-text-muted group-hover:text-text-inverted">
          #{index}
        </span>
      </div>

      <div className="relative z-10 flex items-center gap-4 sm:gap-6">
        <div className="relative shrink-0">
          <div className="size-12 rounded-2xl bg-brand-500/10 p-0.5 transition-transform group-hover:rotate-6 sm:size-16 sm:rounded-3xl">
            <img 
              src={user.picture.large} 
              className="size-full rounded-[inherit] object-cover" 
              alt={user.name.first} 
            />
          </div>
          <div className="bg-success-500 absolute -right-1 -bottom-1 size-5 rounded-full border-2 border-surface" />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="truncate text-base font-black tracking-tight text-text-main sm:text-xl">
            {user.name.first} {user.name.last}
          </h3>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
            <div className="text-tiny flex items-center gap-1 font-bold text-text-muted transition-colors group-hover:text-brand-500 sm:text-xs">
              <Mail className="size-3" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="text-tiny flex items-center gap-1 font-bold text-text-muted sm:text-xs">
              <span className="text-tiny rounded-md bg-muted px-1.5 py-0.5 tracking-tight uppercase opacity-50">
                {user.location.country}
              </span>
            </div>
          </div>
        </div>

        <button className="hidden items-center justify-center rounded-2xl bg-brand-500/10 p-3 text-brand-500 opacity-0 transition-all group-hover:opacity-100 hover:bg-brand-500 hover:text-text-inverted sm:flex">
          <UserIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}
