import { useState, useEffect } from 'react';
import CommentFeed from './CommentFeed';
import LiveAnalyticsChart from './LiveAnalyticsChart';
import './ViralDashboard.css';

export default function ViralDashboard({ title, videoSrc, onStop }) {
  const [running, setRunning] = useState(true);

  const [viewsActive, setViewsActive] = useState(true);
  const [likesActive, setLikesActive] = useState(true);
  const [subsActive, setSubsActive] = useState(true);

  const [viewSpeed, setViewSpeed] = useState(1);
  const [likeSpeed, setLikeSpeed] = useState(1);
  const [subSpeed, setSubSpeed] = useState(1);
  const [commentSpeed, setCommentSpeed] = useState(1);


  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [subs, setSubs] = useState(0);
  const [commentCount, setCommentCount] = useState(0);


  const [analyticsData, setAnalyticsData] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);

  const stopSimulation = () => {
    setRunning(false);
    onStop();
  };

  useEffect(() => {
    if (!running) return;

    const viewInterval = setInterval(() => {
      if (viewsActive) {
        setViews(prev => prev + Math.floor((Math.random() * 10 + 1) * viewSpeed));
      }
    }, 100);

    const likeInterval = setInterval(() => {
      if (likesActive) {
        setLikes(prev => prev + Math.floor((Math.random() * 3 + 1) * likeSpeed));
      }
    }, 300);

    const subInterval = setInterval(() => {
      if (subsActive) {
        setSubs(prev => prev + Math.floor(1 * subSpeed));
      }
    }, 2000);

    return () => {
      clearInterval(viewInterval);
      clearInterval(likeInterval);
      clearInterval(subInterval);
    };
  }, [running, viewsActive, likesActive, subsActive, viewSpeed, likeSpeed, subSpeed]);

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 2);
    }, 2000);

    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (!running) return;

    const newPoint = {
      time: elapsedTime,
      views,
      likes,
      subs,
      comments: commentCount
    };

    setAnalyticsData(prevData => [...prevData, newPoint]);
  }, [elapsedTime, views, likes, subs, commentCount, running]);


  return (
    <div className="dashboard-page">
      <div className="topbar">
        <div className="video-title">{title}</div>

        <button
          className={`pause-btn ${running ? '' : 'paused'}`}
          onClick={() => setRunning(prev => !prev)}
        >
          {running ? '⏸️ Pause Simulation' : '▶️ Resume Simulation'}
        </button>

        <button className="stop-btn" onClick={stopSimulation}>
          Stop Simulation
        </button>
      </div>

      <div className="dashboard-container">
        <video src={videoSrc} controls autoPlay muted className="video-player" />

        <div className="stats-row">
          <div className="stat-card">
            <p>Views</p>
            <div className="counter">{views.toLocaleString()}</div>
            <button
              className={`toggle-btn ${viewsActive ? '' : 'paused'}`}
              onClick={() => setViewsActive(prev => !prev)}
            >
              {viewsActive ? '⏸️ Pause Views' : '▶️ Resume Views'}
            </button>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={viewSpeed}
              onChange={e => setViewSpeed(parseFloat(e.target.value))}
            />
            <p>Speed: {viewSpeed.toFixed(1)}x</p>
          </div>

          <div className="stat-card">
            <p>Likes</p>
            <div className="counter">{likes.toLocaleString()}</div>
            <button
              className={`toggle-btn ${likesActive ? '' : 'paused'}`}
              onClick={() => setLikesActive(prev => !prev)}
            >
              {likesActive ? '⏸️ Pause Likes' : '▶️ Resume Likes'}
            </button>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={likeSpeed}
              onChange={e => setLikeSpeed(parseFloat(e.target.value))}
            />
            <p>Speed: {likeSpeed.toFixed(1)}x</p>
          </div>

          <div className="stat-card">
            <p>Subscribers</p>
            <div className="counter">{subs.toLocaleString()}</div>
            <button
              className={`toggle-btn ${subsActive ? '' : 'paused'}`}
              onClick={() => setSubsActive(prev => !prev)}
            >
              {subsActive ? '⏸️ Pause Subs' : '▶️ Resume Subs'}
            </button>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={subSpeed}
              onChange={e => setSubSpeed(parseFloat(e.target.value))}
            />
            <p>Speed: {subSpeed.toFixed(1)}x</p>
          </div>
        </div>

        <div className="stat-card">
          <p>Comments</p>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={commentSpeed}
            onChange={e => setCommentSpeed(parseFloat(e.target.value))}
          />
          <p>Speed: {commentSpeed.toFixed(1)}x</p>
        </div>

        <CommentFeed
          running={running}
          speed={commentSpeed}
          onNewComment={() => setCommentCount(prev => prev + 1)}
        />
        <div className="analytics-section">
          <LiveAnalyticsChart data={analyticsData} />
        </div>
      </div>
    </div>
  );
}
