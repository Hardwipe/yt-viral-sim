import React from 'react';
import { render, screen, act, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import CommentFeed from './CommentFeed';

describe('CommentFeed', () => {
  const originalMathRandom = Math.random;
  const originalDateNow = Date.now;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    cleanup();
  });

  afterEach(() => {
    act(() => {
      vi.runOnlyPendingTimers();
    });
    vi.useRealTimers();
    Math.random = originalMathRandom;
    Date.now = originalDateNow;
  });

  function mockRandomSequence(values) {
    let index = 0;
    Math.random = vi.fn(() => {
      const value = values[index];
      index += 1;
      return value ?? 0.1;
    });
  }

  it('renders default heading with zero comments', () => {
    render(<CommentFeed running={false} speed={1} />);

    expect(screen.getByRole('heading', { name: /comments \(0\)/i })).toBeInTheDocument();
  });

  it('uses totalCommentCount when provided', () => {
    render(
      <CommentFeed
        running={false}
        speed={1}
        totalCommentCount={12345}
      />
    );

    expect(
      screen.getByRole('heading', { name: /comments \(12,345\)/i })
    ).toBeInTheDocument();
  });

  it('does not create comments when not running', () => {
    const onNewComment = vi.fn();

    render(
      <CommentFeed
        running={false}
        speed={1}
        onNewComment={onNewComment}
      />
    );

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(onNewComment).not.toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: /comments \(0\)/i })).toBeInTheDocument();
  });

  it('does not create comments when comments are paused', () => {
    const onNewComment = vi.fn();

    render(
      <CommentFeed
        running
        speed={1}
        commentsPaused
        onNewComment={onNewComment}
      />
    );

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(onNewComment).not.toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: /comments \(0\)/i })).toBeInTheDocument();
  });

  it('does not create comments when speed is zero', () => {
    const onNewComment = vi.fn();

    render(
      <CommentFeed
        running
        speed={0}
        onNewComment={onNewComment}
      />
    );

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(onNewComment).not.toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: /comments \(0\)/i })).toBeInTheDocument();
  });

  it('creates a new comment on the normal interval and calls onNewComment with the created comment', () => {
    const onNewComment = vi.fn();
    Date.now = vi.fn(() => 1700000000000);

    mockRandomSequence([
      0.0,  // comment text
      0.0,  // username base name
      0.2,  // no suffix
      0.2,  // no number
      0.0,  // handle word1
      0.2,  // no word2
      0.2,  // no handle num
      0.0,  // avatar
      0.1,  // secondsAgo => 3
      0.2,  // likes => 0
      0.12345678, // id random 1
      0.87654321, // id random 2
    ]);

    render(
      <CommentFeed
        running
        speed={1}
        onNewComment={onNewComment}
      />
    );

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(onNewComment).toHaveBeenCalledTimes(1);

    expect(screen.getByRole('heading', { name: /comments \(1\)/i })).toBeInTheDocument();
    expect(screen.getByText(/this blew up fast!/i)).toBeInTheDocument();
    expect(screen.getByText('Jake')).toBeInTheDocument();
    expect(screen.getByText('@trend')).toBeInTheDocument();
    expect(document.querySelector('.comment-avatar')).toBeInTheDocument();
    expect(screen.getByText('just now')).toBeInTheDocument();
    expect(
    screen.getByText((content) => content.includes('👍'))
    ).toBeInTheDocument();

    const createdComment = onNewComment.mock.calls[0][0];
    expect(createdComment).toMatchObject({
      text: 'This blew up fast!',
      user: 'Jake',
      handle: '@trend',
    });
  });

  it('uses the speed prop to shorten the interval', () => {
    const onNewComment = vi.fn();

    mockRandomSequence(new Array(100).fill(0.1));

    render(
      <CommentFeed
        running
        speed={2}
        onNewComment={onNewComment}
      />
    );

    act(() => {
      vi.advanceTimersByTime(2499);
    });

    expect(onNewComment).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(onNewComment).toHaveBeenCalledTimes(1);
  });

  it('enforces the minimum adjusted interval of 200ms at very high speed', () => {
    const onNewComment = vi.fn();

    mockRandomSequence(new Array(500).fill(0.1));

    render(
      <CommentFeed
        running
        speed={100}
        onNewComment={onNewComment}
      />
    );

    act(() => {
      vi.advanceTimersByTime(199);
    });

    expect(onNewComment).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(onNewComment).toHaveBeenCalledTimes(1);
  });

  it('resets comments when resetTrigger changes', () => {
    const onNewComment = vi.fn();

    mockRandomSequence(new Array(100).fill(0.1));

    const { rerender } = render(
      <CommentFeed
        running
        speed={1}
        resetTrigger={0}
        onNewComment={onNewComment}
      />
    );

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByRole('heading', { name: /comments \(1\)/i })).toBeInTheDocument();

    rerender(
      <CommentFeed
        running
        speed={1}
        resetTrigger={1}
        onNewComment={onNewComment}
      />
    );

    expect(screen.getByRole('heading', { name: /comments \(0\)/i })).toBeInTheDocument();
  });

  it('updates to the latest onNewComment callback via ref', () => {
    const firstCallback = vi.fn();
    const secondCallback = vi.fn();

    mockRandomSequence(new Array(100).fill(0.1));

    const { rerender } = render(
      <CommentFeed
        running
        speed={1}
        onNewComment={firstCallback}
      />
    );

    rerender(
      <CommentFeed
        running
        speed={1}
        onNewComment={secondCallback}
      />
    );

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(firstCallback).not.toHaveBeenCalled();
    expect(secondCallback).toHaveBeenCalledTimes(1);
  });

  it('adds bot raid comments, calls onNewComment for each, and calls onBotRaidComplete once', () => {
    const onNewComment = vi.fn();
    const onBotRaidComplete = vi.fn();

    mockRandomSequence(new Array(500).fill(0.1));

    render(
      <CommentFeed
        running={false}
        speed={1}
        botRaidCount={3}
        onNewComment={onNewComment}
        onBotRaidComplete={onBotRaidComplete}
      />
    );

    expect(onNewComment).toHaveBeenCalledTimes(3);
    expect(onBotRaidComplete).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('heading', { name: /comments \(3\)/i })).toBeInTheDocument();
  });

  it('does nothing when botRaidCount is zero', () => {
    const onNewComment = vi.fn();
    const onBotRaidComplete = vi.fn();

    render(
      <CommentFeed
        running={false}
        speed={1}
        botRaidCount={0}
        onNewComment={onNewComment}
        onBotRaidComplete={onBotRaidComplete}
      />
    );

    expect(onNewComment).not.toHaveBeenCalled();
    expect(onBotRaidComplete).not.toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: /comments \(0\)/i })).toBeInTheDocument();
  });

  it('renders a non-zero like count when generated', () => {
    Date.now = vi.fn(() => 1700000000000);

    mockRandomSequence([
      0.0,  // comment text
      0.0,  // username base name
      0.2,  // no suffix
      0.2,  // no number
      0.0,  // handle word1
      0.2,  // no word2
      0.2,  // no handle num
      0.0,  // avatar
      0.1,  // secondsAgo => 3
      0.9,  // likes yes
      0.5,  // like amount => 451
      0.12345678, // id random 1
      0.87654321, // id random 2
    ]);

    render(
      <CommentFeed
        running
        speed={1}
      />
    );

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(
        screen.getByText((content) => content.includes('👍'))
        ).toBeInTheDocument();
  });

  it('formats comment age as just now', () => {
    Date.now = vi.fn(() => 1700000000000);

    mockRandomSequence([
      0.0, 0.0, 0.2, 0.2, 0.0, 0.2, 0.2, 0.0,
      0.0, // secondsAgo => 1
      0.2,
      0.12345678,
      0.87654321,
    ]);

    render(<CommentFeed running speed={1} />);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText('just now')).toBeInTheDocument();
  });

  it('keeps only the latest 250 visible comments', () => {
    const onNewComment = vi.fn();

    mockRandomSequence(new Array(10000).fill(0.1));

    render(
      <CommentFeed
        running
        speed={100}
        onNewComment={onNewComment}
      />
    );

    act(() => {
      vi.advanceTimersByTime(250 * 200);
    });

    expect(screen.getByRole('heading', { name: /comments \(250\)/i })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(50 * 200);
    });

    expect(screen.getByRole('heading', { name: /comments \(250\)/i })).toBeInTheDocument();
    expect(onNewComment).toHaveBeenCalledTimes(300);
  });

  it('renders newest comments first', () => {
    Date.now = vi.fn()
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce(2000);

    mockRandomSequence([
      // first generated comment
      0.0, 0.0, 0.2, 0.2, 0.0, 0.2, 0.2, 0.0, 0.1, 0.2, 0.1234, 0.5678,
      // second generated comment
      0.01, 0.02, 0.2, 0.2, 0.03, 0.2, 0.2, 0.04, 0.1, 0.2, 0.2234, 0.6678,
    ]);

    render(<CommentFeed running speed={1} />);

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    const bodies = screen.getAllByText(/^💬 /i);
    expect(bodies).toHaveLength(2);

    expect(bodies[0].textContent).not.toBe(bodies[1].textContent);
  });
});