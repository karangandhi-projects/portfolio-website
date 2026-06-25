import { describe, it, expect } from 'vitest';
import { estimateReadingTime } from './readingTime';

describe('estimateReadingTime', () => {
  it('rounds up to whole minutes at 200 wpm', () => {
    const text = Array(201).fill('word').join(' '); // 201 words
    expect(estimateReadingTime(text)).toBe('2 min read');
  });

  it('never returns less than 1 min', () => {
    expect(estimateReadingTime('short')).toBe('1 min read');
  });

  it('ignores leading/trailing and repeated whitespace', () => {
    expect(estimateReadingTime('  one   two  ')).toBe('1 min read');
  });

  it('handles an empty string as 1 min', () => {
    expect(estimateReadingTime('')).toBe('1 min read');
  });
});
