import React from 'react';

interface MarkerProps {
    lat: number;
    lng: number;
    text?: string;
}

const Marker: React.FC<MarkerProps> = ({ text }) => {
    return (
        <div style={{ cursor: 'pointer'}}>
            <img src="/marker.png" alt="marker" />
            <span style={{ fontWeight: 'bold'}}>{text || '📍'}</span>
        </div>
    )
}

export default Marker