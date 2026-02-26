import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Quote, QuoteErrorType } from '../../data/quote.model';

@Component({
  selector: 'app-quote-card',
  templateUrl: './quote-card.html',
  styleUrl: './quote-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteCard {
  isLoading = input.required<boolean>();
  quote = input<Quote | null>(null);
  errorType = input<QuoteErrorType | null>(null);

  refreshClicked = output<void>();
}
