import { useState, useEffect } from 'react';

export default function Counter({ start, minIncrease, maxIncrease, intervalMs, running }) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      const randomIncrease = Math.floor(Math.random() * (maxIncrease - minIncrease + 1)) + minIncrease;
      setCount(prev => prev + randomIncrease);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [minIncrease, maxIncrease, intervalMs, running]);

  return (
    <div className="counter">{count.toLocaleString()}</div>
  );
}
