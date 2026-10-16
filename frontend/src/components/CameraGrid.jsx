import { useState } from 'react';
import './CameraGrid.css';

function CameraGrid({ cameras, detections, onToggleCamera }) {
  const [selectedCamera, setSelectedCamera] = useState(null);

  const getCameraDetections = (cameraId) => {
    return detections.filter(d => d.cameraId === cameraId).slice(-5);
  };

  return (
    <div className="camera-grid">
      <div className="grid-header">
        <h2>Live Camera Feeds</h2>
        <div className="camera-stats">
          <span className="stat">
            <span className="stat-value">{cameras.length}</span>
            <span className="stat-label">Total Cameras</span>
          </span>
          <span className="stat">
            <span className="stat-value">{cameras.filter(c => c.status === 'active').length}</span>
            <span className="stat-label">Active</span>
          </span>
        </div>
      </div>

      <div className="grid-container">
        {cameras.map(camera => (
          <div
            key={camera.id}
            className={`camera-card ${camera.status === 'active' ? 'active' : 'inactive'}`}
            onClick={() => setSelectedCamera(camera)}
          >
            <div className="camera-header">
              <h3>{camera.name}</h3>
              <button
                className={`status-toggle ${camera.status}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCamera(camera.id);
                }}
              >
                {camera.status === 'active' ? '●' : '○'}
              </button>
            </div>

            <div className="camera-feed">
              {camera.status === 'active' ? (
                <div className="feed-placeholder">
                  <div className="feed-animation">
                    <div className="scan-line"></div>
                  </div>
                  <span className="feed-text">Live Feed</span>
                </div>
              ) : (
                <div className="feed-placeholder offline">
                  <span className="feed-text">Camera Offline</span>
                </div>
              )}

              {camera.status === 'active' && getCameraDetections(camera.id).length > 0 && (
                <div className="detection-overlay">
                  {getCameraDetections(camera.id).map(detection => (
                    <div
                      key={detection.id}
                      className="bounding-box"
                      style={{
                        left: `${detection.boundingBox.x}px`,
                        top: `${detection.boundingBox.y}px`,
                        width: `${detection.boundingBox.width}px`,
                        height: `${detection.boundingBox.height}px`,
                      }}
                    >
                      <span className="detection-label">
                        {detection.type} {(detection.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="camera-info">
              <span className="location">{camera.location}</span>
              <span className={`status-badge ${camera.status}`}>
                {camera.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedCamera && (
        <div className="modal-overlay" onClick={() => setSelectedCamera(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedCamera.name}</h3>
              <button className="close-btn" onClick={() => setSelectedCamera(null)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p><strong>Location:</strong> {selectedCamera.location}</p>
              <p><strong>Status:</strong> {selectedCamera.status}</p>
              <p><strong>Camera ID:</strong> {selectedCamera.id}</p>
              <p><strong>Recent Detections:</strong> {getCameraDetections(selectedCamera.id).length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CameraGrid;
