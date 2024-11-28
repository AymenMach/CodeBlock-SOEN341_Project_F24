import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PeerAssessmentSettings = () => {
  const [isEnabled, setIsEnabled] = useState(null); 
  const [currentState, setCurrentState] = useState(null); 
  const [errorMessage, setErrorMessage] = useState(''); 
  const navigate = useNavigate(); 

  
  useEffect(() => {
    const fetchPeerAssessmentSettings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/peer-assessment-settings');
        if (!response.ok) {
          throw new Error('Failed to fetch peer assessment settings');
        }
        const data = await response.json();
        if (data.length > 0) {
          const latestSettings = data[0]; 
          setCurrentState(latestSettings.isEnabled); 
          setIsEnabled(latestSettings.isEnabled); 
        }
      } catch (error) {
        console.error('Error fetching peer assessment settings:', error);
      }
    };

    fetchPeerAssessmentSettings();
  }, []);

  
  const handleSelect = (enabled) => {
    if (enabled === true && currentState === true) {
      setErrorMessage('Peer assessments are already enabled.'); 
    } else if (enabled === false && currentState === false) {
      setErrorMessage('Peer assessments are already disabled.');
    } else {
      setIsEnabled(enabled);
      setErrorMessage(''); 
    }
  };

  // save the settings
  const handleSave = async () => {
    if (isEnabled === null) {
      setErrorMessage('Please select either Enable or Disable before saving.');
      return;
    }

    // prepare settings data with current time and date
    const settingsData = {
      isEnabled,
      timestamp: new Date().toISOString(), 
    };

    try {
      const response = await fetch('http://localhost:5000/api/peer-assessment-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData?.message || 'Failed to save settings.');
        return;
      }

      const data = await response.json();
      alert(data.message); 

      // re-fetch settings after saving
      await fetchPeerAssessmentSettings();
    } catch (error) {
      alert('An error occurred while saving settings.');
    }
  };

  // function to re-fetch the peer assessment settings and update the state
  const fetchPeerAssessmentSettings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/peer-assessment-settings');
      if (!response.ok) {
        throw new Error('Failed to fetch peer assessment settings');
      }
      const data = await response.json();
      if (data.length > 0) {
        const latestSettings = data[0];
        setCurrentState(latestSettings.isEnabled); 
        setIsEnabled(latestSettings.isEnabled); 
      }
    } catch (error) {
      console.error('Error fetching peer assessment settings:', error);
    }
  };

  const handleBackClick = () => {
    navigate('/instructor-dashboard'); 
  };

  return (
    <div className="peer-assessment-settings">
      <h1>Peer Assessment Settings</h1>

      <div className="settings-section">
        <label>
          <input
            type="radio"
            name="peerAssessment"
            checked={isEnabled === true}
            onChange={() => handleSelect(true)} 
            disabled={currentState === true} 
          />
          Enable Peer Assessments
        </label>
        <label>
          <input
            type="radio"
            name="peerAssessment"
            checked={isEnabled === false}
            onChange={() => handleSelect(false)} 
            disabled={currentState === false} 
          />
          Disable Peer Assessments
        </label>
      </div>

      {errorMessage && (
        <div className="error-message" style={{ color: 'red' }}>
          {errorMessage}
        </div>
      )}

      <div className="actions-section">
        <button onClick={handleSave} disabled={isEnabled === null}>
          Save Settings
        </button>
        <button onClick={handleBackClick}>Back to Dashboard</button>
      </div>
    </div>
  );
};

export default PeerAssessmentSettings;
