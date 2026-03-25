import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import Counter from './Counter';

describe('Counter', () => {
  const originalMathRandom = Math.random;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    act(() => {
      vi.runOnlyPendingTimers();
    });
    vi.useRealTimers();
    Math.random = originalMathRandom;
  });

  it('renders initial start value', () => {
    render(
      <Counter
        start={100}
        minIncrease={1}
        maxIncrease={5}
        intervalMs={1000}
        running={false}
      />
    );

    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('does not increment when not running', () => {
    render(
      <Counter
        start={100}
        minIncrease={1}
        maxIncrease={5}
        intervalMs={1000}
        running={false}
      />
    );

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('increments count over time when running', () => {
    Math.random = vi.fn(() => 0); // always minIncrease

    render(
      <Counter
        start={100}
        minIncrease={2}
        maxIncrease={5}
        intervalMs={1000}
        running={true}
      />
    );

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('102')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('104')).toBeInTheDocument();
  });

  it('respects maxIncrease when Math.random is high', () => {
    Math.random = vi.fn(() => 0.999); // always maxIncrease

    render(
      <Counter
        start={0}
        minIncrease={1}
        maxIncrease={10}
        intervalMs={1000}
        running={true}
      />
    );

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('uses values within min/max range', () => {
    Math.random = vi.fn(() => 0.5); // midpoint

    render(
      <Counter
        start={0}
        minIncrease={1}
        maxIncrease={9}
        intervalMs={1000}
        running={true}
      />
    );

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // midpoint of 1–9 = ~5
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('formats numbers with locale (commas)', () => {
    Math.random = vi.fn(() => 0.999);

    render(
      <Counter
        start={999}
        minIncrease={1}
        maxIncrease={1}
        intervalMs={1000}
        running={true}
      />
    );

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('1,000')).toBeInTheDocument();
  });

  it('stops incrementing when running becomes false', () => {
    Math.random = vi.fn(() => 0);

    const { rerender } = render(
      <Counter
        start={0}
        minIncrease={1}
        maxIncrease={1}
        intervalMs={1000}
        running={true}
      />
    );

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('1')).toBeInTheDocument();

    rerender(
      <Counter
        start={0}
        minIncrease={1}
        maxIncrease={1}
        intervalMs={1000}
        running={false}
      />
    );

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('cleans up interval when dependencies change (no double increments)', () => {
    Math.random = vi.fn(() => 0);

    const { rerender } = render(
      <Counter
        start={0}
        minIncrease={1}
        maxIncrease={1}
        intervalMs={1000}
        running={true}
      />
    );

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('1')).toBeInTheDocument();

    // change interval → should not double up timers
    rerender(
      <Counter
        start={0}
        minIncrease={1}
        maxIncrease={1}
        intervalMs={500}
        running={true}
      />
    );

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('handles multiple ticks correctly', () => {
    Math.random = vi.fn(() => 0);

    render(
      <Counter
        start={0}
        minIncrease={1}
        maxIncrease={1}
        intervalMs={1000}
        running={true}
      />
    );

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText('5')).toBeInTheDocument();
  });
});