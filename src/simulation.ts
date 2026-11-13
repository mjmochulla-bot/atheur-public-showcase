// Original educational simulation. No production trading rules are included.
export const symbols = ['BTC', 'ETH', 'SOL'] as const;
export type Symbol = typeof symbols[number];
export const INITIAL = 100000;
export const basePrices: Record<Symbol, number> = { BTC: 68420, ETH: 3540, SOL: 148 };
export type Position = { id: number; symbol: Symbol; quantity: number; entry: number; stop: number; target: number };
export type Fill = { id: number; tick: number; symbol: Symbol; side: 'BUY' | 'SELL'; quantity: number; price: number; reason: string; pnl: number };
export type State = { cash: number; tick: number; positions: Position[]; fills: Fill[]; prices: Record<Symbol, number>; equity: number[]; nextId: number };
export function initialState(): State { return { cash: INITIAL, tick: 0, positions: [], fills: [], prices: { ...basePrices }, equity: [INITIAL], nextId: 1 }; }
export function priceAt(symbol: Symbol, tick: number) { const phase = symbols.indexOf(symbol) * 1.8; return basePrices[symbol] * (1 + Math.sin(tick * .29 + phase) * .012 + Math.sin(tick * .83 + phase) * .003 - Math.sin(phase) * .015); }
export function value(s: State) { return s.cash + s.positions.reduce((sum, p) => sum + p.quantity * s.prices[p.symbol], 0); }
export function buy(s: State, symbol: Symbol, amount: number, stopPct: number, targetPct: number, maxAllocation: number): State {
  if (!symbols.includes(symbol) || ![amount, stopPct, targetPct, maxAllocation].every(Number.isFinite)) throw Error('Enter valid numeric values.');
  if (amount < 10 || amount > s.cash) throw Error('Order must be at least $10 and within available cash.');
  if (stopPct < .1 || stopPct > 20 || targetPct < .1 || targetPct > 50 || maxAllocation < 1 || maxAllocation > 50) throw Error('Risk settings are outside the allowed range.');
  const exposure = s.positions.reduce((sum, p) => sum + p.quantity * s.prices[p.symbol], 0);
  if (exposure + amount > value(s) * maxAllocation / 100 + 1e-8) throw Error('Order exceeds the total portfolio allocation limit.');
  const price = s.prices[symbol], quantity = amount / price;
  const p = { id: s.nextId, symbol, quantity, entry: price, stop: price * (1 - stopPct / 100), target: price * (1 + targetPct / 100) };
  return { ...s, cash: s.cash - amount, positions: [...s.positions, p], nextId: s.nextId + 1, fills: [{ id: s.nextId, tick: s.tick, symbol, side: 'BUY', quantity, price, reason: 'Visitor paper order', pnl: 0 }, ...s.fills] };
}
export function close(s: State, id: number, reason = 'Visitor close'): State {
  const p = s.positions.find(p => p.id === id); if (!p) return s;
  const price = s.prices[p.symbol];
  return { ...s, cash: s.cash + p.quantity * price, positions: s.positions.filter(x => x.id !== id), nextId: s.nextId + 1, fills: [{ id: s.nextId, tick: s.tick, symbol: p.symbol, side: 'SELL', quantity: p.quantity, price, reason, pnl: (price - p.entry) * p.quantity }, ...s.fills] };
}
export function advance(s: State): State {
  const tick = s.tick + 1;
  let next = { ...s, tick, prices: Object.fromEntries(symbols.map(x => [x, priceAt(x, tick)])) as Record<Symbol, number> };
  for (const p of [...next.positions]) { const price = next.prices[p.symbol]; if (price <= p.stop) next = close(next, p.id, 'Stop-loss triggered'); else if (price >= p.target) next = close(next, p.id, 'Take-profit triggered'); }
  return { ...next, equity: [...next.equity, value(next)].slice(-120) };
}
