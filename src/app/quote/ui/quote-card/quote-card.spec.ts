import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuoteCard } from './quote-card';

describe('QuoteCard — attribution', () => {
  let fixture: ComponentFixture<QuoteCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteCard],
    }).compileComponents();

    fixture = TestBed.createComponent(QuoteCard);
  });

  const setupSuccess = () => {
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('quote', { text: 'Test quote', author: 'Author' });
    fixture.componentRef.setInput('errorType', null);
    fixture.detectChanges();
  };

  it('should render attribution element in success state', () => {
    setupSuccess();
    const el = fixture.nativeElement.querySelector('.card__attribution');
    expect(el).toBeTruthy();
  });

  it('should display correct attribution text', () => {
    setupSuccess();
    const el: HTMLAnchorElement = fixture.nativeElement.querySelector('.card__attribution');
    expect(el.textContent?.trim()).toBe('Inspirational quotes provided by ZenQuotes API');
  });

  it('should link to zenquotes.io', () => {
    setupSuccess();
    const el: HTMLAnchorElement = fixture.nativeElement.querySelector('.card__attribution');
    expect(el.getAttribute('href')).toBe('https://zenquotes.io');
  });

  it('should open in new tab', () => {
    setupSuccess();
    const el: HTMLAnchorElement = fixture.nativeElement.querySelector('.card__attribution');
    expect(el.getAttribute('target')).toBe('_blank');
  });

  it('should have rel="noopener noreferrer"', () => {
    setupSuccess();
    const el: HTMLAnchorElement = fixture.nativeElement.querySelector('.card__attribution');
    expect(el.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('should show attribution when isLoading is true', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.componentRef.setInput('quote', null);
    fixture.componentRef.setInput('errorType', null);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.card__attribution');
    expect(el).toBeTruthy();
  });

  it('should show attribution when errorType is set', () => {
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('quote', null);
    fixture.componentRef.setInput('errorType', 'timeout');
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.card__attribution');
    expect(el).toBeTruthy();
  });
});
