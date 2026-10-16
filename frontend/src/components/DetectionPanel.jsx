import './DetectionPanel.css';

function DetectionPanel({ detections, cameras }) {
  const getCameraName = (cameraId) => {
    const camera = cameras.find(c => c.id === cameraId);
    return camera ? camera.name : `Camera ${cameraId}`;
  };

  const getDetectionTypeColor = (type) => {
    switch (type) {
      case 'person':
        return '#ff6b6b';
      case 'vehicle':
        return '#00d4ff';
      case 'weapon':
        return '#ff9500';
      default:
        return '#a0aec0';
    }
  };

  const sortedDetections = [...detections].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  const detectionCounts = detections.reduce((acc, d) => {
    acc[d.type] = (acc[d.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="detection-panel">
      <div className="panel-header">
        <h2>Detection History</h2>
        <div className="detection-summary">
          {Object.entries(detectionCounts).map(([type, count]) => (
            <span key={type} className="summary-item">
              <span
                className="summary-dot"
                style={{ backgroundColor: getDetectionTypeColor(type) }}
              ></span>
              <span className="summary-label">{type}</span>
              <span className="summary-count">{count}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="detection-list">
        {sortedDetections.length === 0 ? (
          <div className="empty-state">
            <p>No detections recorded yet</p>
          </div>
        ) : (
          sortedDetections.map(detection => (
            <div key={detection.id} className="detection-item">
              <div className="detection-icon">
                <div
                  className="icon-circle"
                  style={{ backgroundColor: getDetectionTypeColor(detection.type) }}
                >
                  {detection.type === 'person' ? '👤' : 
                   detection.type === 'vehicle' ? '🚗' : 
                   detection.type === 'weapon' ? '⚠️' : '❓'}
                </div>
              </div>

              <div className="detection-details">
                <div className="detection-header">
                  <h3 className="detection-type">
                    {detection.type.charAt(0).toUpperCase() + detection.type.slice(1)}
                  </h3>
                  <span className="detection-confidence">
                    {(detection.confidence * 100).toFixed(0)}% confidence
                  </span>
                </div>

                <p className="detection-camera">
                  {getCameraName(detection.cameraId)}
                </p>

                <p className="detection-time">
                  {new Date(detection.timestamp).toLocaleString()}
                </p>
              </div>

              <div className="detection-meta">
                <div className="confidence-bar">
                  <div
                    className="confidence-fill"
                    style={{
                      width: `${detection.confidence * 100}%`,
                      backgroundColor: getDetectionTypeColor(detection.type)
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DetectionPanel;
