import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { QuoteCard } from '../../ui/quote-card/quote-card';
import { QuoteService } from '../../data/quote.service';
import { QuoteErrorType, QuoteState } from '../../data/quote.model';

@Component({
  selector: 'app-quote-container',
  templateUrl: './quote-container.html',
  styleUrl: './quote-container.scss',
  imports: [QuoteCard],
})
export class QuoteContainer {
  private readonly quoteService = inject(QuoteService);
  private readonly destroyRef = inject(DestroyRef);

  readonly state = signal<QuoteState>({ status: 'loading' });

  readonly isLoading = computed(() => this.state().status === 'loading');

  readonly quote = computed(() => {
    const s = this.state();
    return s.status === 'success' ? s.quote : null;
  });

  readonly errorType = computed(() => {
    const s = this.state();
    return s.status === 'error' ? s.errorType : null;
  });

  constructor() {
    this.loadQuote();
  }

  loadQuote(): void {
    this.state.set({ status: 'loading' });
    this.quoteService
      .getRandomQuote()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (quote) => this.state.set({ status: 'success', quote }),
        error: (errorType: QuoteErrorType) =>
          this.state.set({ status: 'error', errorType }),
      });
  }
}
