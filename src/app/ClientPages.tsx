'use client';
// Pages that only make sense with this browser's progress: rendered in the browser alone (no
// prerendered markup to mismatch), each still its own lazily loaded chunk.
import dynamic from 'next/dynamic';

export const Review = dynamic(() => import('../screens/Review').then((m) => m.Review), { ssr: false });
export const MockSetup = dynamic(() => import('../screens/MockSetup').then((m) => m.MockSetup), { ssr: false });
export const SessionSummary = dynamic(() => import('../screens/SessionSummary').then((m) => m.SessionSummary), { ssr: false });
export const Settings = dynamic(() => import('../screens/Settings').then((m) => m.Settings), { ssr: false });
export const Architecture = dynamic(() => import('../screens/Architecture').then((m) => m.Architecture), { ssr: false });
export const Verify = dynamic(() => import('../screens/Verify'), { ssr: false });
