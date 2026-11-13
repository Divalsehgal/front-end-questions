// Both vitest projects: Next's router modules, swapped for the memory router in ./navigation.
import { afterEach, vi } from 'vitest';
import { setRoute } from './navigation';

vi.mock('next/navigation', () => import('./navigation'));
vi.mock('next/link', async () => ({ default: (await import('./navigation')).Link }));

afterEach(() => setRoute('/'));
