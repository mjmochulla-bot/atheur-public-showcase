// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, it } from 'vitest';
import { act } from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
afterEach(()=>{document.body.innerHTML='';});
it('navigates all sections and executes an independent paper trade',async()=>{
 window.scrollTo=()=>{};
 document.body.innerHTML='<div id="root"></div>';
 await act(async()=>{await import('./main');});
 expect(screen.getByText('Intelligence, coordinated.')).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'Trading simulator'}));
 await waitFor(()=>expect(screen.getByRole('button',{name:/Execute paper buy/})).toBeTruthy());
 fireEvent.click(screen.getByRole('button',{name:/Execute paper buy/}));
 await waitFor(()=>expect(screen.getByText(/Simulated BTC buy filled/)).toBeTruthy());
 fireEvent.click(screen.getByRole('button',{name:'Close'}));
 await waitFor(()=>expect(screen.getByText('Paper position closed.')).toBeTruthy());
 for(const page of ['Agent network','Analytics','System health','Developer mode','Command center']) {fireEvent.click(screen.getByRole('button',{name:page})); await waitFor(()=>expect(screen.getByRole('heading',{name:page,level:1})).toBeTruthy());}
});

