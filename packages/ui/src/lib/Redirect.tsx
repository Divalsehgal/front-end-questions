'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/** Replaces the current history entry with `to` after render . */
export function Redirect({ to }: Readonly<{ to: string }>) {
  const router = useRouter();
  useEffect(() => router.replace(to), [router, to]);
  return null;
}
