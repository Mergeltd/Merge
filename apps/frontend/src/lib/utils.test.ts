import { describe, expect, it } from 'vitest';
import { cn, getInitials } from './utils';

describe('getInitials', () => {
  it('takes the first letter of each name, uppercased', () => {
    expect(getInitials('Grace', 'Wanjiru')).toBe('GW');
    expect(getInitials('brian', 'mutiso')).toBe('BM');
  });

  it('handles a missing name gracefully rather than throwing', () => {
    expect(getInitials('', '')).toBe('');
    expect(getInitials('Grace', '')).toBe('G');
    expect(getInitials('', 'Wanjiru')).toBe('W');
  });
});

describe('cn', () => {
  it('merges class names and resolves Tailwind conflicts (last one wins)', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('drops falsy values', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b');
  });
});
