import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export default function LiveAnalyticsChart({ data }) {
  console.log('Chart received data:', data);

  return (
    <div className="analytics-container">
      <h2>📊 Live Analytics</h2>

      <LineChart width={800} height={400} data={data}>
        <CartesianGrid stroke="#eee" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="views" stroke="#FF0000" dot={false} isAnimationActive={false} />
        <Line type="monotone" dataKey="likes" stroke="#0000FF" dot={false} isAnimationActive={false} />
        <Line type="monotone" dataKey="subs" stroke="#00C853" dot={false} isAnimationActive={false} />
        <Line type="monotone" dataKey="comments" stroke="#FF9900" dot={false} isAnimationActive={false} />
      </LineChart>
    </div>
  );
}
