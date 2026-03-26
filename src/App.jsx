import { useState, useRef } from 'react';
import ViralDashboard from './components/ViralDashboard';
import './App.css';
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [videoTitle, setVideoTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);         // actual File object
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null); // blob preview url
  const [started, setStarted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [youtubeQueued, setYoutubeQueued] = useState(false);
  const [detectedType, setDetectedType] = useState(null);

  const fileInputRef = useRef(null);
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [subs, setSubs] = useState(0);
  const [analyticsData, setAnalyticsData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);

      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }

      setVideoPreviewUrl(URL.createObjectURL(file));
      setUploadMessage('');
      setYoutubeQueued(false);
      setDetectedType(null);
    }
  };

  const uploadToBackend = async () => {
    if (!videoFile || !videoTitle.trim()) {
      setUploadMessage('Please provide both a title and a video file.');
      return false;
    }

    try {
      setUploading(true);
      setUploadMessage('Uploading video and queueing YouTube background job...');

      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('title', videoTitle);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setYoutubeQueued(true);
      setDetectedType(data.detected_upload_type || null);
      setUploadMessage(
        data.message || 'Video uploaded successfully and queued for YouTube.'
      );

      return true;
    } catch (err) {
      console.error(err);
      setUploadMessage(`Upload failed: ${err.message}`);
      return false;
    } finally {
      setUploading(false);
    }
  };

  const handleStartSimulation = async () => {
    const ok = await uploadToBackend();
    if (ok) {
      setStarted(true);
    }
  };

  const resetSimulation = () => {
    setVideoTitle('');
    setVideoFile(null);

    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }

    setVideoPreviewUrl(null);
    setStarted(false);
    setUploading(false);
    setUploadMessage('');
    setYoutubeQueued(false);
    setDetectedType(null);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="brand-title">
          <span className="brand">FakeTube</span>
        </div>

        <a
          href="https://www.buymeacoffee.com/FakeTube"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-1.svg"
            alt="Buy Me A Coffee"
            style={{ height: '40px', marginTop: '10px' }}
          />
        </a>

        <p className="tagline">World’s Totally Not Most Realistic Virality Simulator</p>
      </header>

      <Analytics />

      {!started ? (
        <div className="upload-card">
          <input
            type="text"
            placeholder="Enter fake video title..."
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
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
            disabled={uploading}
          >
            📤 Upload Video
          </button>

          {videoFile && (
            <p style={{ marginTop: '10px' }}>
              Selected: <strong>{videoFile.name}</strong>
            </p>
          )}

          {detectedType && (
            <p style={{ marginTop: '10px' }}>
              Detected YouTube type: <strong>{detectedType}</strong>
            </p>
          )}

          {uploadMessage && (
            <p style={{ marginTop: '10px' }}>
              {uploadMessage}
            </p>
          )}

          <button
            className="yt-button"
            disabled={!videoTitle || !videoFile || uploading}
            onClick={handleStartSimulation}
          >
            {uploading ? '⏳ Uploading...' : '▶️ Start Simulation'}
          </button>

          {youtubeQueued && (
            <p style={{ marginTop: '10px' }}>
              ✅ Background YouTube upload job queued.
            </p>
          )}
        </div>
      ) : (
        <ViralDashboard
          title={videoTitle}
          videoSrc={videoPreviewUrl}
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