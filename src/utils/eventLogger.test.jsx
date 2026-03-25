import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  logEvent,
  getLoggedEvents,
  clearLoggedEvents
} from './eventLogger';

describe('eventLogger', () => {
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    console.log = vi.fn();
    console.error = vi.fn();
  });

  afterEach(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  it('logs an event to console and localStorage', () => {
    logEvent('TEST_EVENT', { foo: 'bar' });

    const stored = JSON.parse(localStorage.getItem('faketube_events'));

    expect(stored).toHaveLength(1);

    expect(stored[0]).toMatchObject({
      event: 'TEST_EVENT',
      details: { foo: 'bar' }
    });

    expect(stored[0].timestamp).toBeDefined();

    expect(console.log).toHaveBeenCalledWith(
      '📡 FakeTube Event:',
      expect.objectContaining({
        event: 'TEST_EVENT',
        details: { foo: 'bar' }
      })
    );
  });

  it('appends multiple events to localStorage', () => {
    logEvent('EVENT_ONE');
    logEvent('EVENT_TWO');

    const stored = JSON.parse(localStorage.getItem('faketube_events'));

    expect(stored).toHaveLength(2);
    expect(stored[0].event).toBe('EVENT_ONE');
    expect(stored[1].event).toBe('EVENT_TWO');
  });

  it('uses empty details object by default', () => {
    logEvent('NO_DETAILS');

    const stored = JSON.parse(localStorage.getItem('faketube_events'));

    expect(stored[0].details).toEqual({});
  });

  it('getLoggedEvents returns stored events', () => {
    logEvent('A');
    logEvent('B');

    const events = getLoggedEvents();

    expect(events).toHaveLength(2);
    expect(events[0].event).toBe('A');
    expect(events[1].event).toBe('B');
  });

  it('getLoggedEvents returns empty array if storage is empty', () => {
    const events = getLoggedEvents();
    expect(events).toEqual([]);
  });

  it('clearLoggedEvents removes all stored events', () => {
    logEvent('A');
    logEvent('B');

    clearLoggedEvents();

    const events = getLoggedEvents();
    expect(events).toEqual([]);
  });

  it('handles corrupted localStorage gracefully when logging', () => {
    localStorage.setItem('faketube_events', 'invalid-json');

    logEvent('SAFE_EVENT');

    expect(console.error).toHaveBeenCalledWith(
      'Failed to store FakeTube event:',
      expect.any(Error)
    );
  });

  it('handles corrupted localStorage gracefully when reading', () => {
    localStorage.setItem('faketube_events', 'invalid-json');

    const events = getLoggedEvents();

    expect(events).toEqual([]);
  });

  it('stores timestamp as ISO string', () => {
    logEvent('TIME_TEST');

    const stored = JSON.parse(localStorage.getItem('faketube_events'));

    const timestamp = stored[0].timestamp;

    expect(typeof timestamp).toBe('string');
    expect(() => new Date(timestamp)).not.toThrow();
  });
});