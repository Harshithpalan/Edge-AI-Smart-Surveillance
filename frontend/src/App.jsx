import { useState, useEffect } from 'react';
import CameraGrid from './components/CameraGrid';
import DetectionPanel from './components/DetectionPanel';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('cameras');
  const [cameras, setCameras] = useState([]);
  const [detections, setDetections] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Fetch initial cameras
    fetch('http://localhost:5000/api/cameras')
      .then(res => res.json())
      .then(data => setCameras(data))
      .catch(err => console.error('Failed to fetch cameras:', err));

    // Fetch initial detections
    fetch('http://localhost:5000/api/detections')
      .then(res => res.json())
      .then(data => setDetections(data))
      .catch(err => console.error('Failed to fetch detections:', err));

    // Connect to WebSocket for real-time updates
    const websocket = new WebSocket('ws://localhost:5000');
    
    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === 'cameras') {
        setCameras(message.data);
      } else if (message.type === 'detection') {
        setDetections(prev => [...prev, message.data].slice(-100));
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWs(websocket);

    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, []);

  const toggleCameraStatus = async (cameraId) => {
    const camera = cameras.find(c => c.id === cameraId);
    if (camera) {
      const newStatus = camera.status === 'active' ? 'inactive' : 'active';
      
      try {
        const response = await fetch(`http://localhost:5000/api/cameras/${cameraId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        });
        
        if (response.ok) {
          const updatedCamera = await response.json();
          setCameras(cameras.map(c => c.id === cameraId ? updatedCamera : c));
        }
      } catch (err) {
        console.error('Failed to update camera:', err);
      }
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Edge AI Smart Surveillance</h1>
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span className="status-text">System Online</span>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-btn ${activeTab === 'cameras' ? 'active' : ''}`}
          onClick={() => setActiveTab('cameras')}
        >
          Camera Feeds
        </button>
        <button
          className={`nav-btn ${activeTab === 'detections' ? 'active' : ''}`}
          onClick={() => setActiveTab('detections')}
        >
          Detections
        </button>
        <button
          className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button
          className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'cameras' && (
          <CameraGrid
            cameras={cameras}
            detections={detections}
            onToggleCamera={toggleCameraStatus}
          />
        )}
        {activeTab === 'detections' && (
          <DetectionPanel detections={detections} cameras={cameras} />
        )}
        {activeTab === 'analytics' && (
          <Analytics detections={detections} cameras={cameras} />
        )}
        {activeTab === 'settings' && (
          <Settings />
        )}
      </main>
    </div>
  );
}

export default App;
