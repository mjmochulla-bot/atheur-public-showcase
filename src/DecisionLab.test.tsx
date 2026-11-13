// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import DecisionLab from './DecisionLab';
afterEach(cleanup);
it('reveals an eligible recommendation without automatically executing a trade',()=>{const trade=vi.fn();render(<DecisionLab onTrade={trade}/>);for(const label of ['Reveal Scout review','Reveal risk review','Reveal final decision'])fireEvent.click(screen.getByRole('button',{name:label}));expect(screen.getByText('PAPER BUY ELIGIBLE')).toBeTruthy();expect(trade).not.toHaveBeenCalled();fireEvent.click(screen.getByRole('button',{name:/Try a separate/}));expect(trade).toHaveBeenCalledOnce();});
it('resets review when changing scenario and explains a risk veto',()=>{render(<DecisionLab onTrade={()=>{}}/>);fireEvent.click(screen.getByRole('button',{name:'Reveal Scout review'}));fireEvent.click(screen.getByRole('button',{name:'Good signal, blocked trade'}));expect(screen.getByText('Review stage 0 / 3')).toBeTruthy();for(const label of ['Reveal Scout review','Reveal risk review','Reveal final decision'])fireEvent.click(screen.getByRole('button',{name:label}));expect(screen.getByText('HOLD · RISK VETO')).toBeTruthy();expect(screen.queryByRole('button',{name:/Try a separate/})).toBeNull();});
