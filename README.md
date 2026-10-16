# Edge AI Smart Surveillance

A full-stack web application for real-time AI-powered surveillance monitoring with live camera feeds, object detection, and analytics dashboard.

## Features

- **Live Camera Feeds**: Real-time monitoring of multiple surveillance cameras
- **AI Object Detection**: Automatic detection of persons, vehicles, and other objects with confidence scores
- **Real-time Alerts**: WebSocket-based instant notifications for new detections
- **Detection History**: Track and review all detection events with timestamps
- **Analytics Dashboard**: Visual insights with charts and statistics
- **Camera Management**: Toggle camera status and view detailed information
- **Configurable Settings**: Customize detection thresholds, notifications, and data retention

## Tech Stack

### Frontend
- React 18 with Vite
- Recharts for data visualization
- WebSocket for real-time updates
- CSS3 with modern styling

### Backend
- Node.js with Express
- WebSocket server for real-time communication
- RESTful API for camera and detection management
- In-memory data storage (demo mode)

## Project Structure

```
Edge AI Smart Surveillance/
├── backend/
│   ├── server.js          # Express server with WebSocket
│   └── package.json       # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CameraGrid.jsx      # Camera feed display
│   │   │   ├── DetectionPanel.jsx  # Detection history
│   │   │   ├── Analytics.jsx       # Analytics dashboard
│   │   │   └── Settings.jsx        # System settings
│   │   ├── App.jsx         # Main application
│   │   └── App.css         # Global styles
│   └── package.json        # Frontend dependencies
└── README.md               # This file
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Clone or navigate to the project directory**
   ```bash
   cd "Edge AI Smart Surveillance"
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

## Running the Application

### Start the Backend Server

From the backend directory:
```bash
cd backend
npm start
```

The backend server will start on `http://localhost:5000`

### Start the Frontend Development Server

From the frontend directory (in a new terminal):
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` (or another port if 5173 is in use)

## Usage

### Camera Feeds Tab
- View all configured cameras in a grid layout
- Click the status button (●/○) to toggle camera on/off
- Active cameras show simulated live feeds with scanning animation
- Detections are displayed as bounding boxes on camera feeds
- Click on a camera card to view detailed information

### Detections Tab
- View complete detection history
- Filter by detection type (person, vehicle, etc.)
- See confidence scores and timestamps
- Color-coded by detection type

### Analytics Tab
- Overview statistics (total detections, active cameras, avg confidence)
- Detection type distribution (pie chart)
- Detections per camera (bar chart)
- Recent detection confidence trends
- Average confidence by detection type

### Settings Tab
- Configure detection threshold (50-100%)
- Adjust model sensitivity (low/medium/high)
- Set alert cooldown period
- Manage data retention settings
- Enable/disable notifications
- Configure email alerts
- View system information

## API Endpoints

### REST API

- `GET /api/cameras` - Get all cameras
- `GET /api/cameras/:id` - Get specific camera
- `PATCH /api/cameras/:id` - Update camera status
- `GET /api/detections` - Get detection history (optional: ?cameraId=X&limit=Y)

### WebSocket Events

- **Message Types**:
  - `cameras` - Initial camera list
  - `detection` - Real-time detection update

- **Connection**: `ws://localhost:5000`

## Demo Mode

The application currently runs in demo mode with:
- 4 pre-configured cameras
- Simulated AI detections every 3 seconds
- In-memory data storage
- Random detection types (person, vehicle, unknown)

## Future Enhancements

- Integration with real camera feeds (RTSP/HTTP)
- Actual AI model integration (YOLO, TensorFlow, etc.)
- Database persistence (MongoDB, PostgreSQL)
- User authentication and authorization
- Video recording and playback
- Mobile-responsive design improvements
- Export detection reports
- Advanced alert rules and triggers

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm run dev  # Vite dev server with HMR
```

### Building for Production
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

## Troubleshooting

### Backend won't start
- Ensure port 5000 is not in use
- Check Node.js version (v16+ required)
- Verify all dependencies are installed

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check CORS settings in backend
- Verify WebSocket connection in browser console

### WebSocket connection fails
- Check backend logs for errors
- Ensure WebSocket server is running
- Verify firewall settings

## License

MIT

## Support

For issues or questions, please refer to the project documentation or contact the development team.
