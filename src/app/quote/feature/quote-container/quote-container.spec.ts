import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Subject, throwError } from 'rxjs';

import { QuoteContainer } from './quote-container';
import { QuoteService } from '../../data/quote.service';
import { Quote } from '../../data/quote.model';

function makeSubject() {
  return new Subject<Quote>();
}

describe('QuoteContainer', () => {
  let component: QuoteContainer;
  let serviceSpy: { getRandomQuote: ReturnType<typeof vi.fn> };
  let subject$: Subject<Quote>;

  beforeEach(() => {
    subject$ = makeSubject();
    serviceSpy = { getRandomQuote: vi.fn().mockReturnValue(subject$.asObservable()) };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: QuoteService, useValue: serviceSpy },
      ],
    });

    component = TestBed.createComponent(QuoteContainer).componentInstance;
  });

  // ── US1: Exibição Inicial ──────────────────────────────────────────────────

  it('US1: estado inicial é loading', () => {
    expect(component.state().status).toBe('loading');
    expect(component.isLoading()).toBe(true);
  });

  it('US1: após sucesso, estado é success com a quote', () => {
    const mockQuote: Quote = { text: 'Texto', author: 'Autor' };
    subject$.next(mockQuote);
    subject$.complete();

    expect(component.state().status).toBe('success');
    expect(component.quote()).toEqual(mockQuote);
  });

  it('US1: isLoading() é false após sucesso (anti-loading-infinito)', () => {
    subject$.next({ text: 'Texto', author: 'Autor' });
    subject$.complete();

    expect(component.isLoading()).toBe(false);
  });

  // ── US2: Refresh ───────────────────────────────────────────────────────────

  it('US2: chamar loadQuote() após sucesso volta para loading', () => {
    subject$.next({ text: 'Texto', author: 'Autor' });
    subject$.complete();

    const newSubject$ = makeSubject();
    serviceSpy.getRandomQuote.mockReturnValue(newSubject$.asObservable());

    component.loadQuote();

    expect(component.state().status).toBe('loading');
    expect(component.isLoading()).toBe(true);
  });

  it('US2: após Refresh bem-sucedido, nova quote é exibida e isLoading() é false', () => {
    subject$.next({ text: 'Primeira', author: 'A1' });
    subject$.complete();

    const newSubject$ = makeSubject();
    serviceSpy.getRandomQuote.mockReturnValue(newSubject$.asObservable());
    component.loadQuote();

    newSubject$.next({ text: 'Segunda', author: 'A2' });
    newSubject$.complete();

    expect(component.quote()?.text).toBe('Segunda');
    expect(component.isLoading()).toBe(false);
  });

  // ── US3: Tratamento de Erro ────────────────────────────────────────────────

  it('US3: erro status 0 resulta em errorType "no-connection"', () => {
    serviceSpy.getRandomQuote.mockReturnValue(throwError(() => 'no-connection'));
    component.loadQuote();

    expect(component.state().status).toBe('error');
    expect(component.errorType()).toBe('no-connection');
    expect(component.isLoading()).toBe(false);
  });

  it('US3: TimeoutError resulta em errorType "timeout"', () => {
    serviceSpy.getRandomQuote.mockReturnValue(throwError(() => 'timeout'));
    component.loadQuote();

    expect(component.state().status).toBe('error');
    expect(component.errorType()).toBe('timeout');
  });

  it('US3: erro de servidor resulta em errorType "server-error"', () => {
    serviceSpy.getRandomQuote.mockReturnValue(throwError(() => 'server-error'));
    component.loadQuote();

    expect(component.state().status).toBe('error');
    expect(component.errorType()).toBe('server-error');
  });

  it('US3: chamar loadQuote() após erro volta para loading', () => {
    serviceSpy.getRandomQuote.mockReturnValue(throwError(() => 'server-error'));
    component.loadQuote();

    const newSubject$ = makeSubject();
    serviceSpy.getRandomQuote.mockReturnValue(newSubject$.asObservable());
    component.loadQuote();

    expect(component.state().status).toBe('loading');
  });
});
