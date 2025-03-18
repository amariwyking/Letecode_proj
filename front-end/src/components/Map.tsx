// Map.tsx
import React, { useEffect, useRef, useState } from 'react';
import GoogleMapReact from 'google-map-react';

// 用于在地图上显示的自定义 Marker
function Marker({ text }) {
  return (
    <div style={{ 
      transform: 'translate(-50%, -50%)', 
      fontWeight: 'bold', 
      background: 'white', 
      padding: '4px', 
      border: '1px solid #ccc',
      borderRadius: '4px'
    }}>
      {text}
    </div>
  );
}

export default function Map({ center, zoom, routesData = [] }) {
  const [mapObj, setMapObj] = useState(null);
  const [mapsObj, setMapsObj] = useState(null);

  // 用来存储当前绘制在地图上的所有折线，方便在更新时清理
  const polylinesRef = useRef([]);

  // 当 google-map-react 加载完成后，会回调这里
  const handleApiLoaded = (map, maps) => {
    setMapObj(map);
    setMapsObj(maps);
  };

  // 当 routesData 或 mapObj / mapsObj 变化时，重新绘制线路
  useEffect(() => {
    if (!mapObj || !mapsObj) return;

    // 先移除旧的线路
    polylinesRef.current.forEach(polyline => polyline.setMap(null));
    polylinesRef.current = [];

    // 根据 routesData 渲染新的线路
    routesData.forEach((route) => {
      // 假设 route.path 是一个 [ [lat1, lng1], [lat2, lng2], ... ] 的数组
      const routePath = route.path.map(coord => ({ lat: coord[0], lng: coord[1] }));

      // 创建 Google Maps 的 Polyline 实例
      const polyline = new mapsObj.Polyline({
        path: routePath,
        geodesic: true,
        strokeColor: route.color || '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3,
      });
      // 显示到地图上
      polyline.setMap(mapObj);

      // 存起来，后面可以在更新时清理
      polylinesRef.current.push(polyline);
    });

    // 如果有其他信息需要渲染，比如 “实时车辆位置”，也可以在这里用 Marker 做标记
  }, [mapObj, mapsObj, routesData]);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'YOUR_GOOGLE_MAPS_API_KEY' }} 
        defaultCenter={center}
        defaultZoom={zoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={handleApiLoaded}
      >
        {/*
          如果想用 `google-map-react` 原生的方式渲染自定义 Marker，
          可以把 Marker 组件作为子组件放在这里，并通过 lat/lng 指定位置
        */}
        {routesData.map((route, idx) =>
          route.vehicles?.map((vehicle, vIdx) => (
            <Marker 
              key={`${idx}-${vIdx}`}
              lat={vehicle.lat}
              lng={vehicle.lng}
              text={vehicle.name}
            />
          ))
        )}
      </GoogleMapReact>
    </div>
  );
}