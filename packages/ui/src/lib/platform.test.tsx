import { renderHook } from '@testing-library/react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useModKey } from './platform';

// An own property shadows jsdom's Navigator.prototype getter; deleting it restores the default.
const setPlatform = (value: string) => Object.defineProperty(navigator, 'platform', { value, configurable: true });

describe('useModKey', () => {
  beforeEach(() => setPlatform('MacIntel'));
  afterEach(() => Reflect.deleteProperty(navigator, 'platform'));

  it('renders Ctrl in server HTML even on a Mac, so hydration matches whatever the server ran on', () => {
    function Shortcut() {
      return createElement('kbd', null, useModKey());
    }
    expect(renderToString(createElement(Shortcut))).toBe('<kbd>Ctrl</kbd>');
  });

  it('switches to ⌘ on a Mac once hydrated', () => {
    expect(renderHook(() => useModKey()).result.current).toBe('⌘');
  });

  it('stays Ctrl elsewhere', () => {
    setPlatform('Win32');
    expect(renderHook(() => useModKey()).result.current).toBe('Ctrl');
  });
});
