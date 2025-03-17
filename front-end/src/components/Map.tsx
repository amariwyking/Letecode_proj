// Map.tsx (TypeScript)
import React from 'react';
import GoogleMapReact from 'google-map-react';

interface MapProps {
  center: { lat: number; lng: number };
  zoom: number;
}

const Map: React.FC<MapProps> = ({ center, zoom }) => {
  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '' }}
        defaultCenter={center}
        defaultZoom={zoom}
      >
        {/* 这里可以放置标记(Marker)组件等 */}
      </GoogleMapReact>
    </div>
  );
};

export default Map;