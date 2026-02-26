import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { TimeoutError } from 'rxjs';

import { Quote, QuoteErrorType, ZenQuoteDto } from './quote.model';

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private readonly http = inject(HttpClient);

  getRandomQuote(): Observable<Quote> {
    return this.http.get<ZenQuoteDto[]>('/api/random').pipe(
      timeout(10_000),
      map(([dto]) => this.mapDto(dto)),
      catchError((err) => throwError(() => this.mapError(err))),
    );
  }

  private mapDto(dto: ZenQuoteDto): Quote {
    return {
      text: dto.q,
      author: dto.a?.trim() || 'Autor desconhecido',
    };
  }

  private mapError(err: unknown): QuoteErrorType {
    if (err instanceof TimeoutError) {
      return 'timeout';
    }
    if (err instanceof HttpErrorResponse && err.status === 0) {
      return 'no-connection';
    }
    return 'server-error';
  }
}
