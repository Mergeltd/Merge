import { describe, expect, it } from 'vitest';
import { toUserMessage } from './errors';

describe('toUserMessage', () => {
  it('maps a permission-denied SQLSTATE to a friendly message', () => {
    expect(toUserMessage({ code: '42501' })).toBe("You don't have permission to do that.");
  });

  it('maps a foreign-key violation to a friendly message', () => {
    expect(toUserMessage({ code: '23503' })).toBe('That action refers to something that no longer exists.');
  });

  it('maps PGRST116 (zero rows from .single()) to a permission-or-missing message', () => {
    expect(toUserMessage({ code: 'PGRST116' })).toBe("You don't have permission to do that, or it no longer exists.");
  });

  it('maps a known unique-constraint violation by name', () => {
    expect(
      toUserMessage({
        code: '23505',
        message: 'duplicate key value violates unique constraint "reviews_booking_id_author_id_key"',
      })
    ).toBe("You've already reviewed this booking.");
  });

  it('falls back to a generic message for an unrecognized unique-constraint violation', () => {
    expect(toUserMessage({ code: '23505', message: 'duplicate key value violates unique constraint "some_other_key"' })).toBe(
      'That already exists.'
    );
  });

  it('matches P0001 messages by content, not code', () => {
    expect(toUserMessage({ code: 'P0001', message: 'insufficient_funds' })).toBe(
      "This wallet doesn't have enough balance for that."
    );
    expect(toUserMessage({ code: 'P0001', message: 'invalid_status_transition' })).toBe(
      "That booking can't move to that status from where it is."
    );
    expect(toUserMessage({ code: 'P0001', message: 'insufficient_privilege' })).toBe(
      "You don't have permission to do that."
    );
  });

  it('falls back to a generic message for anything unrecognized', () => {
    expect(toUserMessage({ code: '99999', message: 'something weird' })).toBe('Something went wrong. Please try again.');
    expect(toUserMessage(new Error('plain JS error'))).toBe('Something went wrong. Please try again.');
    expect(toUserMessage(null)).toBe('Something went wrong. Please try again.');
  });
});
