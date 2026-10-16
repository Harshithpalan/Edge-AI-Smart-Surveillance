import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Analytics.css';

function Analytics({ detections, cameras }) {
  const analyticsData = useMemo(() => {
    // Detection type distribution
    const typeCounts = detections.reduce((acc, d) => {
      acc[d.type] = (acc[d.type] || 0) + 1;
      return acc;
    }, {});

    const typeData = Object.entries(typeCounts).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
    }));

    // Camera detection counts
    const cameraCounts = cameras.map(camera => ({
      name: camera.name.split(' ')[0],
      detections: detections.filter(d => d.cameraId === camera.id).length,
    }));

    // Detection timeline (last 10 detections)
    const timelineData = detections
      .slice(-10)
      .map(d => ({
        time: new Date(d.timestamp).toLocaleTimeString(),
        confidence: (d.confidence * 100).toFixed(0),
        type: d.type,
      }));

    // Average confidence by type
    const confidenceByType = detections.reduce((acc, d) => {
      if (!acc[d.type]) {
        acc[d.type] = { sum: 0, count: 0 };
      }
      acc[d.type].sum += d.confidence;
      acc[d.type].count += 1;
      return acc;
    }, {});

    const confidenceData = Object.entries(confidenceByType).map(([type, data]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      confidence: ((data.sum / data.count) * 100).toFixed(1),
    }));

    return { typeData, cameraCounts, timelineData, confidenceData };
  }, [detections, cameras]);

  const COLORS = ['#ff6b6b', '#00d4ff', '#ff9500', '#a0aec0', '#7b2cbf'];

  const totalDetections = detections.length;
  const activeCameras = cameras.filter(c => c.status === 'active').length;
  const avgConfidence = detections.length > 0
    ? (detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length * 100).toFixed(1)
    : 0;

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h2>Analytics Dashboard</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <span>📊</span>
          </div>
          <div className="stat-info">
            <p className="stat-label">Total Detections</p>
            <p className="stat-value">{totalDetections}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon cameras">
            <span>📹</span>
          </div>
          <div className="stat-info">
            <p className="stat-label">Active Cameras</p>
            <p className="stat-value">{activeCameras}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon confidence">
            <span>🎯</span>
          </div>
          <div className="stat-info">
            <p className="stat-label">Avg Confidence</p>
            <p className="stat-value">{avgConfidence}%</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon rate">
            <span>⚡</span>
          </div>
          <div className="stat-info">
            <p className="stat-label">Detection Rate</p>
            <p className="stat-value">~1/3s</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Detection Types</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.typeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData.typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3>Detections by Camera</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.cameraCounts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3a5c" />
                <XAxis dataKey="name" stroke="#a0aec0" />
                <YAxis stroke="#a0aec0" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1f3a', border: '1px solid #2d3a5c' }}
                  itemStyle={{ color: '#e0e6ed' }}
                />
                <Bar dataKey="detections" fill="#00d4ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card full-width">
          <h3>Recent Detection Confidence</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3a5c" />
                <XAxis dataKey="time" stroke="#a0aec0" />
                <YAxis stroke="#a0aec0" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1f3a', border: '1px solid #2d3a5c' }}
                  itemStyle={{ color: '#e0e6ed' }}
                />
                <Bar dataKey="confidence" fill="#7b2cbf" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3>Avg Confidence by Type</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.confidenceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3a5c" />
                <XAxis dataKey="name" stroke="#a0aec0" />
                <YAxis stroke="#a0aec0" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1f3a', border: '1px solid #2d3a5c' }}
                  itemStyle={{ color: '#e0e6ed' }}
                />
                <Bar dataKey="confidence" fill="#ff6b6b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
