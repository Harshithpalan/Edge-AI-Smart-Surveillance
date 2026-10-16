import { useState } from 'react';
import './Settings.css';

function Settings() {
  const [settings, setSettings] = useState({
    detectionThreshold: 75,
    alertCooldown: 5,
    maxDetections: 100,
    enableNotifications: true,
    enableRecording: false,
    retentionDays: 30,
    emailAlerts: '',
    modelSensitivity: 'medium',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    setSettings({
      detectionThreshold: 75,
      alertCooldown: 5,
      maxDetections: 100,
      enableNotifications: true,
      enableRecording: false,
      retentionDays: 30,
      emailAlerts: '',
      modelSensitivity: 'medium',
    });
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <h2>System Settings</h2>
        <p className="settings-subtitle">Configure your surveillance system preferences</p>
      </div>

      <div className="settings-grid">
        <div className="settings-section">
          <h3>Detection Settings</h3>
          
          <div className="setting-item">
            <label>
              <span className="setting-label">Detection Threshold</span>
              <span className="setting-value">{settings.detectionThreshold}%</span>
            </label>
            <input
              type="range"
              name="detectionThreshold"
              min="50"
              max="100"
              value={settings.detectionThreshold}
              onChange={handleChange}
              className="range-slider"
            />
            <p className="setting-hint">Minimum confidence level for detection alerts</p>
          </div>

          <div className="setting-item">
            <label>
              <span className="setting-label">Model Sensitivity</span>
            </label>
            <select
              name="modelSensitivity"
              value={settings.modelSensitivity}
              onChange={handleChange}
              className="select-input"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <p className="setting-hint">Higher sensitivity may increase false positives</p>
          </div>

          <div className="setting-item">
            <label>
              <span className="setting-label">Alert Cooldown (seconds)</span>
            </label>
            <input
              type="number"
              name="alertCooldown"
              min="1"
              max="60"
              value={settings.alertCooldown}
              onChange={handleChange}
              className="number-input"
            />
            <p className="setting-hint">Minimum time between consecutive alerts</p>
          </div>
        </div>

        <div className="settings-section">
          <h3>Data Management</h3>
          
          <div className="setting-item">
            <label>
              <span className="setting-label">Max Detections Stored</span>
            </label>
            <input
              type="number"
              name="maxDetections"
              min="10"
              max="1000"
              value={settings.maxDetections}
              onChange={handleChange}
              className="number-input"
            />
            <p className="setting-hint">Maximum number of detection records to keep</p>
          </div>

          <div className="setting-item">
            <label>
              <span className="setting-label">Data Retention (days)</span>
            </label>
            <input
              type="number"
              name="retentionDays"
              min="1"
              max="365"
              value={settings.retentionDays}
              onChange={handleChange}
              className="number-input"
            />
            <p className="setting-hint">Automatically delete detections older than this</p>
          </div>

          <div className="setting-item checkbox-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="enableRecording"
                checked={settings.enableRecording}
                onChange={handleChange}
              />
              <span className="checkbox-text">
                <span className="setting-label">Enable Video Recording</span>
                <span className="setting-hint">Record video clips when detections occur</span>
              </span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3>Notifications</h3>
          
          <div className="setting-item checkbox-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="enableNotifications"
                checked={settings.enableNotifications}
                onChange={handleChange}
              />
              <span className="checkbox-text">
                <span className="setting-label">Enable Desktop Notifications</span>
                <span className="setting-hint">Show browser notifications for alerts</span>
              </span>
            </label>
          </div>

          <div className="setting-item">
            <label>
              <span className="setting-label">Email Alerts</span>
            </label>
            <input
              type="email"
              name="emailAlerts"
              value={settings.emailAlerts}
              onChange={handleChange}
              placeholder="admin@example.com"
              className="text-input"
            />
            <p className="setting-hint">Comma-separated email addresses for alerts</p>
          </div>
        </div>

        <div className="settings-section">
          <h3>System Info</h3>
          
          <div className="info-item">
            <span className="info-label">Backend Version</span>
            <span className="info-value">1.0.0</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Frontend Version</span>
            <span className="info-value">1.0.0</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">API Status</span>
            <span className="info-value status-online">Connected</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">WebSocket</span>
            <span className="info-value status-online">Active</span>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn btn-secondary" onClick={handleReset}>
          Reset to Defaults
        </button>
        <button className="btn btn-primary" onClick={handleSave}>
          Save Settings
        </button>
      </div>
    </div>
  );
}

export default Settings;
