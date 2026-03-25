import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function LiveAnalyticsChart({ data }) {
  const dedupedData = Object.values(
    data.reduce((acc, point) => {
      acc[point.time] = point; // keep latest point for each time value
      return acc;
    }, {})
  ).sort((a, b) => a.time - b.time);

  return (
    <div className="analytics-container">
      <h2>📊 Live Analytics</h2>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={dedupedData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
          <CartesianGrid stroke="#eee" />

          <XAxis
            type="number"
            dataKey="time"
            domain={[0, 'dataMax']}
            tickCount={8}
            minTickGap={30}
            tickFormatter={(value) => `${value}s`}
          />

          <YAxis />

          <Tooltip
            formatter={(value, name) => [value.toLocaleString(), name]}
            labelFormatter={(label) => `Time: ${label}s`}
          />

          <Legend />

          <Line type="monotone" dataKey="comments" stroke="#FF9900" dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="likes" stroke="#0000FF" dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="subs" stroke="#00C853" dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="views" stroke="#FF0000" dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}