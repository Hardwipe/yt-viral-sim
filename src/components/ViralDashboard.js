import { useState, useEffect } from 'react';
import CommentFeed from './CommentFeed';
import LiveAnalyticsChart from './LiveAnalyticsChart';
import './ViralDashboard.css';
import { logEvent } from '../utils/eventLogger';

export default function ViralDashboard({ title, videoSrc, onStop }) {
  const [running, setRunning] = useState(true);

  const [viewsActive, setViewsActive] = useState(true);
  const [likesActive, setLikesActive] = useState(true);
  const [subsActive, setSubsActive] = useState(true);
  const [commentsPaused, setCommentsPaused] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [viewSpeed, setViewSpeed] = useState(1);
  const [likeSpeed, setLikeSpeed] = useState(1);
  const [subSpeed, setSubSpeed] = useState(1);
  const [commentSpeed, setCommentSpeed] = useState(1);

  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [subs, setSubs] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [botRaidCount, setBotRaidCount] = useState(0);
  const [commentResetTrigger, setCommentResetTrigger] = useState(0);

  const initialAnalyticsPoint = {
    time: 0,
    views: 0,
    likes: 0,
    subs: 0,
    comments: 0
  };

  const [analyticsData, setAnalyticsData] = useState([initialAnalyticsPoint]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [analyticsUnlocked, setAnalyticsUnlocked] = useState(false);

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const showTrendingToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const triggerViralBoost = () => {
    const addedViews = Math.floor(Math.random() * 5000 + 2000);
    const addedLikes = Math.floor(Math.random() * 500 + 200);
    const addedSubs = Math.floor(Math.random() * 80 + 20);

    setViews((prev) => prev + addedViews);
    setLikes((prev) => prev + addedLikes);
    setSubs((prev) => prev + addedSubs);

    logEvent('VIRAL_BOOST_TRIGGERED', {
      title,
      addedViews,
      addedLikes,
      addedSubs,
      elapsedTime
    });

    showTrendingToast('🔥 Viral spike detected! Your video is gaining momentum.');
  };

  const triggerBotRaid = () => {
    const raidAmount = Math.floor(Math.random() * 51) + 50; // 50-100
    setBotRaidCount(raidAmount);

    logEvent('BOT_RAID_TRIGGERED', {
      title,
      commentsAdded: raidAmount,
      elapsedTime
    });

    showTrendingToast(`🤖 Bot raid detected! +${raidAmount} comments injected.`);
  };

  const stopSimulation = () => {
    logEvent('SIMULATION_STOPPED', {
      title,
      views,
      likes,
      subs,
      comments: commentCount,
      elapsedTime
    });

    setRunning(false);
    onStop();
  };

  const algorithmConfidence = Math.min(
    99,
    Math.floor(
      35 +
      views / 40 +
      likes / 12 +
      subs * 2 +
      commentCount * 3
    )
  );

  useEffect(() => {
    if (!showToast) return;

    const timeout = setTimeout(() => {
      setShowToast(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [showToast]);

  useEffect(() => {
    if (!running) return;

    const popupInterval = setInterval(() => {
      const roll = Math.random();

      if (roll > 0.92) {
        const popupMessages = [
          '🔥 Your video is gaining traction in the algorithm!',
          '📈 Audience velocity increasing.',
          '🚀 Trending signal detected.',
          '👀 Viewer retention spike detected.',
          '⚡ Engagement velocity increased.',
          '🎯 Recommendation system confidence rising.'
        ];

        const randomMessage =
          popupMessages[Math.floor(Math.random() * popupMessages.length)];

        showTrendingToast(randomMessage);
      }
    }, 7000);

    return () => clearInterval(popupInterval);
  }, [running]);

  useEffect(() => {
    if (!running) return;

    const viewInterval = setInterval(() => {
      if (viewsActive) {
        setViews((prev) => prev + Math.floor((Math.random() * 10 + 1) * viewSpeed));
      }
    }, 100);

    const likeInterval = setInterval(() => {
      if (likesActive) {
        setLikes((prev) => prev + Math.floor((Math.random() * 3 + 1) * likeSpeed));
      }
    }, 300);

    const subInterval = setInterval(() => {
      if (subsActive) {
        setSubs((prev) => prev + Math.floor(1 * subSpeed));
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
      setElapsedTime((prev) => prev + 2);
    }, 2000);

    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (!running || elapsedTime === 0) return;

    const newPoint = {
      time: elapsedTime,
      views,
      likes,
      subs,
      comments: commentCount
    };

    setAnalyticsData((prevData) => {
      const filtered = prevData.filter((point) => point.time !== elapsedTime);
      return [...filtered, newPoint];
    });
  }, [elapsedTime, running, views, likes, subs, commentCount]);

  return (
    <div className={`dashboard-page ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {showToast && (
        <div className="trending-toast">
          {toastMessage}
        </div>
      )}

      <div className="topbar">
        <button
          className="mode-btn"
          onClick={() => {
            const nextDarkMode = !darkMode;
            setDarkMode(nextDarkMode);

            logEvent(nextDarkMode ? 'DARK_MODE_ENABLED' : 'LIGHT_MODE_ENABLED', {
              title
            });
          }}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>

        <button
          className={`pause-btn ${running ? '' : 'paused'}`}
          onClick={() => {
            const nextRunning = !running;
            setRunning(nextRunning);

            logEvent(nextRunning ? 'SIMULATION_RESUMED' : 'SIMULATION_PAUSED', {
              title,
              views,
              likes,
              subs,
              comments: commentCount,
              elapsedTime
            });
          }}
        >
          {running ? '⏸️ Pause Simulation' : '▶️ Resume Simulation'}
        </button>

        <button
          className="secondary-btn"
          onClick={() => {
            logEvent('SIMULATION_RESET', {
              title,
              viewsBeforeReset: views,
              likesBeforeReset: likes,
              subsBeforeReset: subs,
              commentsBeforeReset: commentCount,
              elapsedTime
            });

            setViews(0);
            setLikes(0);
            setSubs(0);
            setCommentCount(0);
            setElapsedTime(0);
            setBotRaidCount(0);
            setAnalyticsData([initialAnalyticsPoint]);
            setCommentResetTrigger((prev) => prev + 1);
            showTrendingToast('🔄 Simulation reset.');
          }}
        >
          🔄 Reset Simulation
        </button>

        <button className="secondary-btn" onClick={triggerViralBoost}>
          🚀 Viral Boost
        </button>

        <button className="secondary-btn" onClick={triggerBotRaid}>
          🤖 Bot Raid
        </button>

        <button
          className="secondary-btn"
          onClick={() => {
            const nextUnlocked = !analyticsUnlocked;
            setAnalyticsUnlocked(nextUnlocked);

            logEvent(nextUnlocked ? 'ANALYTICS_UNLOCKED' : 'ANALYTICS_LOCKED', {
              title,
              elapsedTime,
              views,
              likes,
              subs,
              comments: commentCount
            });
          }}
        >
          {analyticsUnlocked ? '🔒 Lock Analytics' : '🔓 Unlock Analytics'}
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
              onClick={() => setViewsActive((prev) => !prev)}
            >
              {viewsActive ? '⏸️ Pause Views' : '▶️ Resume Views'}
            </button>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={viewSpeed}
              onChange={(e) => setViewSpeed(parseFloat(e.target.value))}
            />
            <p>Speed: {viewSpeed.toFixed(1)}x</p>
          </div>

          <div className="stat-card">
            <p>Likes</p>
            <div className="counter">{likes.toLocaleString()}</div>
            <button
              className={`toggle-btn ${likesActive ? '' : 'paused'}`}
              onClick={() => setLikesActive((prev) => !prev)}
            >
              {likesActive ? '⏸️ Pause Likes' : '▶️ Resume Likes'}
            </button>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={likeSpeed}
              onChange={(e) => setLikeSpeed(parseFloat(e.target.value))}
            />
            <p>Speed: {likeSpeed.toFixed(1)}x</p>
          </div>

          <div className="stat-card">
            <p>Subscribers</p>
            <div className="counter">{subs.toLocaleString()}</div>
            <button
              className={`toggle-btn ${subsActive ? '' : 'paused'}`}
              onClick={() => setSubsActive((prev) => !prev)}
            >
              {subsActive ? '⏸️ Pause Subs' : '▶️ Resume Subs'}
            </button>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={subSpeed}
              onChange={(e) => setSubSpeed(parseFloat(e.target.value))}
            />
            <p>Speed: {subSpeed.toFixed(1)}x</p>
          </div>

          <div className="stat-card">
            <p>Comments</p>
            <div className="counter">{commentCount.toLocaleString()}</div>

            <button
              className={`toggle-btn ${commentsPaused ? 'paused' : ''}`}
              onClick={() => {
                const nextPaused = !commentsPaused;
                setCommentsPaused(nextPaused);

                logEvent(nextPaused ? 'COMMENTS_PAUSED' : 'COMMENTS_RESUMED', {
                  title,
                  elapsedTime
                });
              }}
            >
              {commentsPaused ? '▶️ Resume Comments' : '⏸️ Pause Comments'}
            </button>

            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={commentSpeed}
              onChange={(e) => setCommentSpeed(parseFloat(e.target.value))}
            />
            <p>Speed: {commentSpeed.toFixed(1)}x</p>
          </div>
        </div>

        <CommentFeed
          running={running}
          speed={commentSpeed}
          commentsPaused={commentsPaused}
          botRaidCount={botRaidCount}
          totalCommentCount={commentCount}
          resetTrigger={commentResetTrigger}
          onBotRaidComplete={() => setBotRaidCount(0)}
          onNewComment={() => setCommentCount((prev) => prev + 1)}
        />

        <div className="analytics-section">
          {!analyticsUnlocked && (
            <div className="analytics-paywall">
              <h3>🔒 Live Analytics Locked</h3>
              <p>Your video is generating analytics in the background.</p>
              <p>Unlock Live Analytics to see real-time growth.</p>

              <div className="confidence-meter-wrap">
                <div className="confidence-label-row">
                  <span>Algorithm Confidence</span>
                  <span>{algorithmConfidence}%</span>
                </div>

                <div className="confidence-meter">
                  <div
                    className="confidence-fill"
                    style={{ width: `${algorithmConfidence}%` }}
                  />
                </div>
              </div>

              <button
                className="unlock-btn"
                onClick={() => {
                  setAnalyticsUnlocked(true);

                  logEvent('ANALYTICS_UNLOCKED', {
                    title,
                    elapsedTime,
                    views,
                    likes,
                    subs,
                    comments: commentCount
                  });
                }}
              >
                Unlock Analytics
              </button>
            </div>
          )}

          <div className={`analytics-chart-wrap ${analyticsUnlocked ? 'unlocked' : 'blurred'}`}>
            <LiveAnalyticsChart data={analyticsData} />
          </div>

          <p className="analytics-disclaimer">
            ⚠️ Analytics shown are simulated and may not reflect actual YouTube performance.
          </p>
        </div>
      </div>
    </div>
  );
}