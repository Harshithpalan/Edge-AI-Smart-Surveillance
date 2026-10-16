const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

// In-memory storage for camera feeds and detections
const cameras = new Map();
const detections = new Map();

// Initialize demo cameras
const demoCameras = [
  { id: 1, name: 'Front Entrance', location: 'Main Building', status: 'active' },
  { id: 2, name: 'Parking Lot', location: 'South Wing', status: 'active' },
  { id: 3, name: 'Back Door', location: 'Rear Exit', status: 'inactive' },
  { id: 4, name: 'Warehouse', location: 'Storage Area', status: 'active' }
];

demoCameras.forEach(cam => cameras.set(cam.id, cam));

// REST API Routes

// Get all cameras
app.get('/api/cameras', (req, res) => {
  res.json(Array.from(cameras.values()));
});

// Get camera by ID
app.get('/api/cameras/:id', (req, res) => {
  const camera = cameras.get(parseInt(req.params.id));
  if (camera) {
    res.json(camera);
  } else {
    res.status(404).json({ error: 'Camera not found' });
  }
});

// Update camera status
app.patch('/api/cameras/:id', (req, res) => {
  const camera = cameras.get(parseInt(req.params.id));
  if (camera) {
    cameras.set(parseInt(req.params.id), { ...camera, ...req.body });
    res.json(cameras.get(parseInt(req.params.id)));
  } else {
    res.status(404).json({ error: 'Camera not found' });
  }
});

// Get detection history
app.get('/api/detections', (req, res) => {
  const { cameraId, limit = 50 } = req.query;
  let allDetections = Array.from(detections.values()).flat();
  
  if (cameraId) {
    allDetections = allDetections.filter(d => d.cameraId === parseInt(cameraId));
  }
  
  res.json(allDetections.slice(-limit));
});

// WebSocket for real-time camera feeds and detections
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send initial camera list
  ws.send(JSON.stringify({
    type: 'cameras',
    data: Array.from(cameras.values())
  }));

  // Simulate real-time detections
  const detectionInterval = setInterval(() => {
    const activeCameras = Array.from(cameras.values()).filter(c => c.status === 'active');
    if (activeCameras.length > 0) {
      const randomCamera = activeCameras[Math.floor(Math.random() * activeCameras.length)];
      const detectionTypes = ['person', 'vehicle', 'person', 'person', 'unknown'];
      const confidence = (0.75 + Math.random() * 0.24).toFixed(2);
      
      const detection = {
        id: Date.now(),
        cameraId: randomCamera.id,
        cameraName: randomCamera.name,
        type: detectionTypes[Math.floor(Math.random() * detectionTypes.length)],
        confidence: parseFloat(confidence),
        timestamp: new Date().toISOString(),
        boundingBox: {
          x: Math.floor(Math.random() * 300),
          y: Math.floor(Math.random() * 200),
          width: 100 + Math.floor(Math.random() * 100),
          height: 100 + Math.floor(Math.random() * 100)
        }
      };

      // Store detection
      if (!detections.has(randomCamera.id)) {
        detections.set(randomCamera.id, []);
      }
      detections.get(randomCamera.id).push(detection);

      // Broadcast to all connected clients
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'detection',
            data: detection
          }));
        }
      });
    }
  }, 3000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(detectionInterval);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
