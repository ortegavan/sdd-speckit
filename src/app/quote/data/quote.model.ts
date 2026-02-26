export interface ZenQuoteDto {
  q: string;
  a: string;
  h: string;
}

export interface Quote {
  text: string;
  author: string;
}

export type QuoteErrorType = 'no-connection' | 'timeout' | 'server-error';

export type QuoteState =
  | { status: 'loading' }
  | { status: 'success'; quote: Quote }
  | { status: 'error'; errorType: QuoteErrorType };
