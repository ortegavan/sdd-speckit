import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';

import { QuoteService } from './quote.service';

describe('QuoteService', () => {
  let service: QuoteService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(QuoteService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('mapeia resposta OK para Quote correto', async () => {
    const promise = firstValueFrom(service.getRandomQuote());
    httpTesting.expectOne('/api/random').flush([{ q: 'Texto', a: 'Autor', h: '' }]);
    const quote = await promise;
    expect(quote.text).toBe('Texto');
    expect(quote.author).toBe('Autor');
  });

  it('usa "Autor desconhecido" quando autor está vazio', async () => {
    const promise = firstValueFrom(service.getRandomQuote());
    httpTesting.expectOne('/api/random').flush([{ q: 'Texto', a: '', h: '' }]);
    const quote = await promise;
    expect(quote.author).toBe('Autor desconhecido');
  });

  it('mapeia status 0 para "no-connection"', async () => {
    const promise = firstValueFrom(service.getRandomQuote());
    httpTesting
      .expectOne('/api/random')
      .flush(null, { status: 0, statusText: 'Unknown Error' });
    await expect(promise).rejects.toBe('no-connection');
  });

  it('mapeia status 500 para "server-error"', async () => {
    const promise = firstValueFrom(service.getRandomQuote());
    httpTesting
      .expectOne('/api/random')
      .flush(null, { status: 500, statusText: 'Internal Server Error' });
    await expect(promise).rejects.toBe('server-error');
  });

  it('mapeia TimeoutError para "timeout"', async () => {
    vi.useFakeTimers();
    const promise = firstValueFrom(service.getRandomQuote());
    httpTesting.expectOne('/api/random');
    vi.advanceTimersByTime(11_000);
    await expect(promise).rejects.toBe('timeout');
    vi.useRealTimers();
  });
});
