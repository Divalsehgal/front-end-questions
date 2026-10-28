import { afterEach, describe, expect, it, vi } from 'vitest';
import { assert, createClock, runTests } from './harness';

describe('fake clock', () => {
  let clock = createClock();
  afterEach(() => clock.restore());
  const install = () => {
    clock = createClock();
    clock.install();
    return clock;
  };

  it('runs timers in time order when ticked', () => {
    install();
    const order: string[] = [];
    setTimeout(() => order.push('b'), 20);
    setTimeout(() => order.push('a'), 10);
    const id = setInterval(() => order.push('i'), 15);
    clock.tick(30);
    clearInterval(id);
    clock.tick(100);
    expect(order).toEqual(['a', 'i', 'b', 'i']);
  });

  it('fakes Date.now and advances it to the timer being run', () => {
    install();
    const t0 = Date.now();
    const seen: number[] = [];
    setTimeout(() => seen.push(Date.now() - t0), 40);
    clock.tick(25);
    expect(Date.now() - t0).toBe(25);
    clock.tick(25);
    expect(seen).toEqual([40]);
    expect(Date.now() - t0).toBe(50);
  });

  it('passes extra args, clamps negative delays and lets timers schedule timers', () => {
    install();
    const calls: unknown[] = [];
    setTimeout((a: unknown, b: unknown) => calls.push([a, b]), 5, 'x', 2);
    setTimeout(() => {
      calls.push('outer');
      setTimeout(() => calls.push('inner'), 0);
    }, -10);
    clock.tick(0);
    expect(calls).toEqual(['outer', 'inner']);
    clock.tick(5);
    expect(calls).toEqual(['outer', 'inner', ['x', 2]]);
  });

  it('clearTimeout cancels, and a zero-delay interval still advances', () => {
    install();
    const fired = vi.fn();
    const id = setTimeout(fired, 10);
    clearTimeout(id);
    let n = 0;
    const iv = setInterval(() => n++, 0);
    clock.tick(5);
    clearInterval(iv);
    clock.tick(50);
    expect(fired).not.toHaveBeenCalled();
    expect(n).toBe(6); // every 1ms from 0 to 5
  });

  it('reset drops pending timers', () => {
    install();
    const fired = vi.fn();
    setTimeout(fired, 1);
    clock.reset();
    clock.tick(10);
    expect(fired).not.toHaveBeenCalled();
  });

  it('tick before install throws', () => {
    clock = createClock();
    expect(() => clock.tick(1)).toThrow('clock.tick() called before clock.install()');
  });

  it('install is idempotent and restore puts the real timers back', () => {
    const realSetTimeout = globalThis.setTimeout;
    const realNow = Date.now;
    install();
    const t = Date.now();
    clock.tick(1000);
    clock.install(); // no-op: must not resync now to real time
    expect(Date.now()).toBe(t + 1000);
    expect(globalThis.setTimeout).not.toBe(realSetTimeout);
    clock.restore();
    clock.restore(); // second restore is a no-op
    expect(globalThis.setTimeout).toBe(realSetTimeout);
    expect(Date.now).toBe(realNow);
  });

  it('exposes real timers that keep working while installed', async () => {
    install();
    await new Promise((r) => clock.real.setTimeout(r, 1));
    expect(clock.real.now()).toBeGreaterThan(0);
  });
});

describe('runTests', () => {
  it('reports passes, failures and timeouts independently', async () => {
    const clock = createClock();
    const results = await runTests(
      ({ test }) => {
        test('passes', () => assert.ok(true));
        test('fails', () => assert.equal(1, 2));
        test('hangs', () => new Promise(() => {}));
      },
      clock,
      50,
    );
    expect(results.map((r) => [r.name, r.ok])).toEqual([
      ['passes', true],
      ['fails', false],
      ['hangs', false],
    ]);
    expect(results[1].error).toBe('expected 2, got 1');
    expect(results[2].error).toBe('Error: timed out after 50ms');
    for (const r of results) expect(r.ms).toBeGreaterThanOrEqual(0);
  });

  it('runs async tests and names non-assertion errors', async () => {
    const results = await runTests(({ test }) => {
      test('async ok', async () => {
        await Promise.resolve();
      });
      test('async reject', async () => {
        throw new TypeError('nope');
      });
      test('throws a string', () => {
        throw 'plain';
      });
    }, createClock());
    expect(results.map((r) => [r.ok, r.error])).toEqual([
      [true, undefined],
      [false, 'TypeError: nope'],
      [false, 'plain'],
    ]);
  });

  it('runs tests in order and resets fake timers between them', async () => {
    const clock = createClock();
    clock.install();
    const order: string[] = [];
    try {
      await runTests(({ test }) => {
        test('one', () => {
          order.push('one');
          setTimeout(() => order.push('leaked'), 1);
        });
        test('two', () => {
          clock.tick(10);
          order.push('two');
        });
      }, clock);
    } finally {
      clock.restore();
    }
    expect(order).toEqual(['one', 'two']);
  });

  it('clears the per-test timeout once a test settles', async () => {
    const clock = createClock();
    const set = vi.spyOn(clock.real, 'setTimeout');
    const clear = vi.spyOn(clock.real, 'clearTimeout');
    await runTests(({ test }) => {
      test('a', () => {});
      test('b', () => {
        throw new Error('x');
      });
    }, clock);
    expect(set).toHaveBeenCalledTimes(2);
    expect(clear.mock.calls.map((c) => c[0])).toEqual(set.mock.results.map((r) => r.value));
  });

  it('returns no results when nothing registers', async () => {
    expect(await runTests(() => {}, createClock())).toEqual([]);
  });
});
