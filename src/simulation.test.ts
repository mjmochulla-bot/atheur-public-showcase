import { describe, expect, it } from 'vitest';
import { advance, buy, close, initialState, value } from './simulation';
describe('isolated spot paper ledger', () => {
  it('conserves equity on entry and close, without leverage', () => { const s = buy(initialState(), 'BTC', 1000, 2, 4, 25); expect(s.cash).toBe(99000); expect(value(s)).toBeCloseTo(100000); expect(close(s, s.positions[0].id).cash).toBeCloseTo(100000); });
  it('rejects invalid orders, overspending and aggregate risk breaches', () => { for (const n of [NaN, Infinity, -10, 100001]) expect(() => buy(initialState(), 'BTC', n, 2, 4, 25)).toThrow(); const s = buy(initialState(), 'BTC', 20000, 2, 4, 25); expect(() => buy(s, 'ETH', 6000, 2, 4, 25)).toThrow(/allocation/); });
  it('executes targets at the next synthetic quote', () => { const s = buy(initialState(), 'BTC', 1000, 2, .1, 25); const n = advance(s); expect(n.positions).toHaveLength(0); expect(n.fills[0].reason).toBe('Take-profit triggered'); expect(n.cash).toBeGreaterThan(100000); });
  it('executes stops and records a loss', () => { let s = buy(initialState(), 'BTC', 1000, .1, 50, 25); for (let i = 0; i < 30; i++) s = advance(s); expect(s.positions).toHaveLength(0); expect(s.fills[0].reason).toBe('Stop-loss triggered'); expect(s.fills[0].pnl).toBeLessThan(0); });
  it('is deterministic and leaves input state unchanged', () => { const s = initialState(); expect(advance(s)).toEqual(advance(s)); expect(s.tick).toBe(0); expect(s.cash).toBe(100000); });
});
