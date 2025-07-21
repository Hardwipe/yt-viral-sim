import { useState, useRef } from 'react';
import ViralDashboard from './components/ViralDashboard';
import './App.css';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from '@vercel/speed-insights/next';



function App() {
  const [videoTitle, setVideoTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [started, setStarted] = useState(false);
  const fileInputRef = useRef(null);
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [subs, setSubs] = useState(0);
  const [analyticsData, setAnalyticsData] = useState([]);


  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(URL.createObjectURL(file));
    }
  };

  const resetSimulation = () => {
    setVideoTitle('');
    setVideoFile(null);
    setStarted(false);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="brand-title">
          <span className="brand">FakeTube</span>
        </div>

        <a href="https://www.buymeacoffee.com/FakeTube" target="_blank" rel="noopener noreferrer">
          <img
            src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-1.svg"
            alt="Buy Me A Coffee"
            style={{ height: '40px', marginTop: '10px' }}
          />
        </a>
        <p className="tagline">World’s Totally Not Most Realistic Virality Simulator</p>
      </header>

      <Analytics />
      <SpeedInsights />
      {!started ? (
        <div className="upload-card">
          <input
            type="text"
            placeholder="Enter fake video title..."
            value={videoTitle}
            onChange={e => setVideoTitle(e.target.value)}
            className="title-input"
          />

          <input
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />

          <button
            className="yt-button"
            onClick={() => fileInputRef.current.click()}
          >
            📤 Upload Video
          </button>

          <button
            className="yt-button"
            disabled={!videoTitle || !videoFile}
            onClick={() => setStarted(true)}
          >
            ▶️ Start Simulation
          </button>
        </div>
      ) : (
        <ViralDashboard
          title={videoTitle}
          videoSrc={videoFile}
          onStop={resetSimulation}
          views={views}
          setViews={setViews}
          likes={likes}
          setLikes={setLikes}
          subs={subs}
          setSubs={setSubs}
          analyticsData={analyticsData}
          setAnalyticsData={setAnalyticsData}
        />
      )}
    </div>
  );
}

export default App;
