import { css } from './css';
import { dsa } from './dsa';
import { html } from './html';
import { javascript } from './javascript';
import { machineCoding } from './machine-coding';
import { nextjs } from './nextjs';
import { nodejs } from './nodejs';
import { patterns } from './patterns';
import { react } from './react';
import { security } from './security';
import { systemDesign } from './system-design';
import { testing } from './testing';
import { typescript } from './typescript';
import type { Subject } from '../types';

// Order here is the order on the dashboard and in the sidebar.
export const SUBJECTS: Subject[] = [javascript, typescript, react, nextjs, html, css, dsa, patterns, systemDesign, security, testing, nodejs, machineCoding];
