// ViralDashboard.test.jsx
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import ViralDashboard from './ViralDashboard';

// Mock CSS import
vi.mock('./ViralDashboard.css', () => ({}));

// Mock logger
const logEventMock = vi.fn();
vi.mock('../utils/eventLogger', () => ({
  logEvent: (...args) => logEventMock(...args),
}));

// Mock child components so tests stay focused on ViralDashboard logic
vi.mock('./CommentFeed', () => ({
  default: ({
    onNewComment,
    onBotRaidComplete,
    botRaidCount,
    totalCommentCount,
  }) => (
    <div data-testid="comment-feed">
      <div>Mock CommentFeed</div>
      <div data-testid="comment-count-prop">{totalCommentCount}</div>
      <button onClick={() => onNewComment()} data-testid="add-comment">
        Add Comment
      </button>
      <button
        onClick={() => onBotRaidComplete()}
        data-testid="complete-bot-raid"
      >
        Complete Bot Raid
      </button>
      <div data-testid="bot-raid-count">{botRaidCount}</div>
    </div>
  ),
}));

vi.mock('./LiveAnalyticsChart', () => ({
  default: ({ data }) => (
    <div data-testid="analytics-chart">
      Analytics points: {data.length}
    </div>
  ),
}));

describe('ViralDashboard', () => {
  const defaultProps = {
    title: 'Test Video',
    videoSrc: '/test-video.mp4',
    onStop: vi.fn(),
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    act(() => {
      vi.runOnlyPendingTimers();
    });
    vi.useRealTimers();
  });

  it('renders initial UI state', () => {
    render(<ViralDashboard {...defaultProps} />);

    expect(screen.getByText('Views')).toBeInTheDocument();
    expect(screen.getByText('Likes')).toBeInTheDocument();
    expect(screen.getByText('Subscribers')).toBeInTheDocument();
    expect(screen.getByText('Comments')).toBeInTheDocument();

    expect(screen.getAllByText('0')[0]).toBeInTheDocument();
    expect(screen.getByText(/Live Analytics Locked/i)).toBeInTheDocument();
    expect(screen.getByTestId('analytics-chart')).toBeInTheDocument();
  });

  it('toggles dark mode and logs event', () => {
    render(<ViralDashboard {...defaultProps} />);

    const modeButton = screen.getByRole('button', { name: /dark mode/i });

    act(() => {
      fireEvent.click(modeButton);
    });

    expect(logEventMock).toHaveBeenCalledWith('DARK_MODE_ENABLED', {
      title: 'Test Video',
    });

    expect(
      screen.getByRole('button', { name: /light mode/i })
    ).toBeInTheDocument();
  });

  it('pauses and resumes simulation with log events', () => {
    render(<ViralDashboard {...defaultProps} />);

    const pauseButton = screen.getByRole('button', {
      name: /pause simulation/i,
    });

    act(() => {
      fireEvent.click(pauseButton);
    });

    expect(logEventMock).toHaveBeenCalledWith(
      'SIMULATION_PAUSED',
      expect.objectContaining({
        title: 'Test Video',
      })
    );

    const resumeButton = screen.getByRole('button', {
      name: /resume simulation/i,
    });

    act(() => {
      fireEvent.click(resumeButton);
    });

    expect(logEventMock).toHaveBeenCalledWith(
      'SIMULATION_RESUMED',
      expect.objectContaining({
        title: 'Test Video',
      })
    );
  });

  it('calls onStop and logs event when stopping simulation', () => {
    render(<ViralDashboard {...defaultProps} />);

    act(() => {
      fireEvent.click(
        screen.getByRole('button', { name: /stop simulation/i })
      );
    });

    expect(logEventMock).toHaveBeenCalledWith(
      'SIMULATION_STOPPED',
      expect.objectContaining({
        title: 'Test Video',
      })
    );

    expect(defaultProps.onStop).toHaveBeenCalledTimes(1);
  });

  it('unlocks analytics from paywall button', () => {
    render(<ViralDashboard {...defaultProps} />);

    act(() => {
      fireEvent.click(
        screen.getAllByRole('button', { name: /unlock analytics/i })[0]
      );
    });

    expect(logEventMock).toHaveBeenCalledWith(
      'ANALYTICS_UNLOCKED',
      expect.objectContaining({
        title: 'Test Video',
      })
    );

    expect(
      screen.queryByText(/Live Analytics Locked/i)
    ).not.toBeInTheDocument();
  });

  it('locks and unlocks analytics from topbar toggle', () => {
    render(<ViralDashboard {...defaultProps} />);

    const toggle = screen.getByRole('button', { name: '🔓 Unlock Analytics' });

    act(() => {
      fireEvent.click(toggle);
    });

    expect(
      screen.getByRole('button', { name: /lock analytics/i })
    ).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /lock analytics/i }));
    });

    expect(logEventMock).toHaveBeenCalledWith(
      'ANALYTICS_LOCKED',
      expect.objectContaining({
        title: 'Test Video',
      })
    );
  });

  it('increments comment count when CommentFeed reports a new comment', () => {
    render(<ViralDashboard {...defaultProps} />);

    act(() => {
      fireEvent.click(screen.getByTestId('add-comment'));
    });

    expect(screen.getByTestId('comment-count-prop')).toHaveTextContent('1');
  });

  it('resets simulation counters and analytics', () => {
    render(<ViralDashboard {...defaultProps} />);

    act(() => {
      fireEvent.click(screen.getByTestId('add-comment'));
    });

    act(() => {
      vi.advanceTimersByTime(2500);
    });

    act(() => {
      fireEvent.click(
        screen.getByRole('button', { name: /reset simulation/i })
      );
    });

    expect(logEventMock).toHaveBeenCalledWith(
      'SIMULATION_RESET',
      expect.objectContaining({
        title: 'Test Video',
      })
    );

    expect(screen.getByText('🔄 Simulation reset.')).toBeInTheDocument();
  });

  it('shows and hides toast after timeout', () => {
    render(<ViralDashboard {...defaultProps} />);

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /viral boost/i }));
    });

    expect(
      screen.getByText(/viral spike detected/i)
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(
      screen.queryByText(/viral spike detected/i)
    ).not.toBeInTheDocument();
  });

  it('viral boost logs event', () => {
    const mathSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);

    render(<ViralDashboard {...defaultProps} />);

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /viral boost/i }));
    });

    expect(logEventMock).toHaveBeenCalledWith(
      'VIRAL_BOOST_TRIGGERED',
      expect.objectContaining({
        title: 'Test Video',
      })
    );

    mathSpy.mockRestore();
  });

  it('bot raid logs event and updates mocked child prop', () => {
    const mathSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);

    render(<ViralDashboard {...defaultProps} />);

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: '🤖 Bot Raid' }));
    });

    expect(logEventMock).toHaveBeenCalledWith(
      'BOT_RAID_TRIGGERED',
      expect.objectContaining({
        title: 'Test Video',
      })
    );

    expect(screen.getByTestId('bot-raid-count')).not.toHaveTextContent('0');

    mathSpy.mockRestore();
  });

  it('timer updates analytics over time while running', () => {
    render(<ViralDashboard {...defaultProps} />);

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(screen.getByTestId('analytics-chart')).toHaveTextContent(
      /analytics points:/i
    );
  });
});