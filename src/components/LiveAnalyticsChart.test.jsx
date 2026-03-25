import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import LiveAnalyticsChart from './LiveAnalyticsChart';

const rechartsSpy = {
  responsiveContainerProps: null,
  lineChartProps: null,
  xAxisProps: null,
  yAxisProps: null,
  tooltipProps: null,
  cartesianGridProps: null,
  legendRendered: false,
  lineProps: [],
};

vi.mock('recharts', () => {
  const React = require('react');

  return {
    ResponsiveContainer: ({ children, ...props }) => {
      rechartsSpy.responsiveContainerProps = props;
      return <div data-testid="responsive-container">{children}</div>;
    },

    LineChart: ({ children, ...props }) => {
      rechartsSpy.lineChartProps = props;
      return <div data-testid="line-chart">{children}</div>;
    },

    XAxis: (props) => {
      rechartsSpy.xAxisProps = props;
      return <div data-testid="x-axis" />;
    },

    YAxis: (props) => {
      rechartsSpy.yAxisProps = props;
      return <div data-testid="y-axis" />;
    },

    Tooltip: (props) => {
      rechartsSpy.tooltipProps = props;
      return <div data-testid="tooltip" />;
    },

    CartesianGrid: (props) => {
      rechartsSpy.cartesianGridProps = props;
      return <div data-testid="cartesian-grid" />;
    },

    Legend: () => {
      rechartsSpy.legendRendered = true;
      return <div data-testid="legend" />;
    },

    Line: (props) => {
      rechartsSpy.lineProps.push(props);
      return <div data-testid={`line-${props.dataKey}`} />;
    },
  };
});

describe('LiveAnalyticsChart', () => {
  beforeEach(() => {
    rechartsSpy.responsiveContainerProps = null;
    rechartsSpy.lineChartProps = null;
    rechartsSpy.xAxisProps = null;
    rechartsSpy.yAxisProps = null;
    rechartsSpy.tooltipProps = null;
    rechartsSpy.cartesianGridProps = null;
    rechartsSpy.legendRendered = false;
    rechartsSpy.lineProps = [];
  });

  it('renders the analytics heading', () => {
    render(<LiveAnalyticsChart data={[]} />);

    expect(screen.getByRole('heading', { name: /live analytics/i })).toBeInTheDocument();
  });

  it('passes width and height to ResponsiveContainer', () => {
    render(<LiveAnalyticsChart data={[]} />);

    expect(rechartsSpy.responsiveContainerProps).toMatchObject({
      width: '100%',
      height: 400,
    });
  });

  it('passes deduped and sorted data to LineChart', () => {
    const input = [
      { time: 10, views: 100, likes: 10, subs: 2, comments: 1 },
      { time: 5, views: 50, likes: 5, subs: 1, comments: 0 },
      { time: 10, views: 120, likes: 12, subs: 3, comments: 4 }, // latest duplicate
      { time: 1, views: 10, likes: 1, subs: 0, comments: 0 },
      { time: 5, views: 55, likes: 6, subs: 1, comments: 2 }, // latest duplicate
    ];

    render(<LiveAnalyticsChart data={input} />);

    expect(rechartsSpy.lineChartProps.data).toEqual([
      { time: 1, views: 10, likes: 1, subs: 0, comments: 0 },
      { time: 5, views: 55, likes: 6, subs: 1, comments: 2 },
      { time: 10, views: 120, likes: 12, subs: 3, comments: 4 },
    ]);
  });

  it('keeps the latest point when duplicate time values exist', () => {
    const input = [
      { time: 3, views: 30, likes: 3, subs: 0, comments: 0 },
      { time: 3, views: 99, likes: 9, subs: 4, comments: 7 },
    ];

    render(<LiveAnalyticsChart data={input} />);

    expect(rechartsSpy.lineChartProps.data).toEqual([
      { time: 3, views: 99, likes: 9, subs: 4, comments: 7 },
    ]);
  });

  it('passes chart margin config to LineChart', () => {
    render(<LiveAnalyticsChart data={[]} />);

    expect(rechartsSpy.lineChartProps.margin).toEqual({
      top: 10,
      right: 20,
      left: 10,
      bottom: 10,
    });
  });

  it('configures the XAxis correctly', () => {
    render(<LiveAnalyticsChart data={[]} />);

    expect(rechartsSpy.xAxisProps).toMatchObject({
      type: 'number',
      dataKey: 'time',
      domain: [0, 'dataMax'],
      tickCount: 8,
      minTickGap: 30,
    });
  });

  it('formats x-axis ticks in seconds', () => {
    render(<LiveAnalyticsChart data={[]} />);

    expect(rechartsSpy.xAxisProps.tickFormatter(15)).toBe('15s');
    expect(rechartsSpy.xAxisProps.tickFormatter(0)).toBe('0s');
  });

  it('configures Tooltip formatters correctly', () => {
    render(<LiveAnalyticsChart data={[]} />);

    expect(rechartsSpy.tooltipProps.labelFormatter(12)).toBe('Time: 12s');
    expect(rechartsSpy.tooltipProps.formatter(12345, 'views')).toEqual(['12,345', 'views']);
  });

  it('renders CartesianGrid with expected stroke', () => {
    render(<LiveAnalyticsChart data={[]} />);

    expect(rechartsSpy.cartesianGridProps).toMatchObject({
      stroke: '#eee',
    });
  });

  it('renders YAxis and Legend', () => {
    render(<LiveAnalyticsChart data={[]} />);

    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
    expect(rechartsSpy.legendRendered).toBe(true);
  });

  it('renders four lines with correct data keys', () => {
    render(<LiveAnalyticsChart data={[]} />);

    const dataKeys = rechartsSpy.lineProps.map((line) => line.dataKey);

    expect(dataKeys).toEqual(['comments', 'likes', 'subs', 'views']);
  });

  it('configures all lines as monotone, no dots, and no animation', () => {
    render(<LiveAnalyticsChart data={[]} />);

    for (const line of rechartsSpy.lineProps) {
      expect(line.type).toBe('monotone');
      expect(line.dot).toBe(false);
      expect(line.isAnimationActive).toBe(false);
    }
  });

  it('uses the expected stroke colors for each metric line', () => {
    render(<LiveAnalyticsChart data={[]} />);

    const byKey = Object.fromEntries(
      rechartsSpy.lineProps.map((line) => [line.dataKey, line])
    );

    expect(byKey.comments.stroke).toBe('#FF9900');
    expect(byKey.likes.stroke).toBe('#0000FF');
    expect(byKey.subs.stroke).toBe('#00C853');
    expect(byKey.views.stroke).toBe('#FF0000');
  });

  it('handles empty data safely', () => {
    render(<LiveAnalyticsChart data={[]} />);

    expect(rechartsSpy.lineChartProps.data).toEqual([]);
    expect(screen.getByRole('heading', { name: /live analytics/i })).toBeInTheDocument();
  });
});