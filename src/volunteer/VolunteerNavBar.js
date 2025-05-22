import React from 'react';
import { FaHome, FaMapMarkerAlt, FaUserCircle } from 'react-icons/fa'; // Importing icons from react-icons

const VolunteerNavbar = ({ setViewingProfile, setViewingMap, setShowAppliedOpportunities }) => {
  return (
    <nav style={navbarStyle}>
      <div style={iconContainerStyle}>
        <button
          style={iconButtonStyle}
          onClick={() => { 
            setViewingProfile(false); 
            setViewingMap(false); 
            setShowAppliedOpportunities(false); 
          }}
          title="Home" // Tooltip text
        >
          <FaHome size={40} />
        </button>
        <span style={tooltipStyle}>Home</span>
      </div>

      <div style={iconContainerStyle}>
        <button
          style={iconButtonStyle}
          onClick={() => { 
            setViewingMap(true); 
            setViewingProfile(false); 
          }}
          title="Map" // Tooltip text
        >
          <FaMapMarkerAlt size={40} />
        </button>
        <span style={tooltipStyle}>Map</span>
      </div>

      <div style={iconContainerStyle}>
        <button
          style={iconButtonStyle}
          onClick={() => { 
            setViewingProfile(true); 
            setViewingMap(false); 
          }}
          title="Profile" // Tooltip text
        >
          <FaUserCircle size={40} />
        </button>
        <span style={tooltipStyle}>Profile</span>
      </div>
    </nav>
  );
};

// Inline styles
const navbarStyle = {
  backgroundColor: '#d3d3d3',
  padding: '10px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '50px',
};

const iconButtonStyle = {
  background: 'none',
  border: 'none',
  color: 'black',
  cursor: 'pointer',
  padding: '10px',
  fontSize: '24px',
  transition: 'color 0.3s',
};

const iconContainerStyle = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const tooltipStyle = {
  visibility: 'hidden',
  backgroundColor: '#555',
  color: '#fff',
  textAlign: 'center',
  borderRadius: '5px',
  padding: '5px',
  position: 'absolute',
  bottom: '50px',
  fontSize: '12px',
  opacity: 0,
  transition: 'opacity 0.3s',
};

const iconButtonStyleHover = {
  ':hover': {
    color: '#800000',
  },
};

export default VolunteerNavbar;
