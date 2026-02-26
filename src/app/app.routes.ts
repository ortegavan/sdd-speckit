import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./quote/feature/quote-container/quote-container').then(
        (m) => m.QuoteContainer,
      ),
  },
];
