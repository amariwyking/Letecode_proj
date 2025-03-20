// Map.tsx (TypeScript)
import React from 'react';
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';

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
        options={{
          mapId: '84a43dd24922060d', 
        }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => {
          // 可以在这里使用原生 Maps API 做任何操作，比如画线
          const lineCoordinates = [
            { lat: 40.715, lng: -74.002 },
            { lat: 40.713, lng: -74.000 },
            { lat: 40.710, lng: -73.998 },
            // ...
          ];

          const transitLine = new maps.Polyline({
            path: lineCoordinates,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 4,
          });

          // 把这条线加到地图上
          transitLine.setMap(map);
        }}
      >
        <Marker lat={40.715} lng={-74.002} text="Station A" />
        <Marker lat={40.713} lng={-74.000} text="Station B" />
      </GoogleMapReact>
    </div>
  );
};

export default Map;