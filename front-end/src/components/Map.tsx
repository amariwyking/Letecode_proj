// Map.tsx (TypeScript)
import React, { useEffect, useState, useRef } from 'react';
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';

interface MapProps {
  center: { lat: number; lng: number };
  zoom: number;
}

export default function SubwayMap() {
  const [stations, setStations] = useState([]);          // 存放所有站点数据
  const [lineCoordinates, setLineCoordinates] = useState([]);  // 当前要绘制的线路坐标

  const mapRef = useRef(null);   // 用来保存 map 实例
  const mapsRef = useRef(null);  // 用来保存 maps 对象（google.maps）

  // 用来保存当前绘制在地图上的线路，方便在点击其他站台时清除或更新
  const currentLineRef = useRef(null);

  // 1. 初始化时获取地铁站点数据
  useEffect(() => {
    async function fetchStations() {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/stations');
        const data = await res.json();
        setStations(data);
      } catch (err) {
        console.error('获取站点信息出错', err);
      }
    }
    fetchStations();
  }, []);

  // 2. 点击某个 Marker 时，向后端请求该站的整条线路数据
  const handleMarkerClick = async (stationId) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/line/${stationId}`);
      const data = await res.json();
      setLineCoordinates(data);  // 存到 state 中
    } catch (err) {
      console.error('获取线路数据出错', err);
    }
  };

  // 3. 监听 lineCoordinates 变化，一旦有新线路数据，就用原生 API 进行绘制
  useEffect(() => {
    // 如果 map 或 maps 还没拿到，或者当前 lineCoordinates 为空，则不执行
    if (!mapRef.current || !mapsRef.current || lineCoordinates.length === 0) {
      return;
    }

    // 如果之前已经绘制过一条线了，先把它清掉
    if (currentLineRef.current) {
      currentLineRef.current.setMap(null);
    }

    // 新建并绘制 Polyline
    const newLine = new mapsRef.current.Polyline({
      path: lineCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 4,
    });
    newLine.setMap(mapRef.current);

    // 把这次新建的线路存起来
    currentLineRef.current = newLine;

  }, [lineCoordinates]);

  // 4. Google Map 的 onGoogleApiLoaded 回调
  const handleApiLoaded = ({ map, maps }) => {
    mapRef.current = map;
    mapsRef.current = maps;
  };

  return (
    <div style={{ height: '90vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '' }}
        defaultCenter={{ lat: 40.714, lng: -74.001 }} // 默认中心点可自行设置
        defaultZoom={14}                            // 默认缩放级别
        options={{
          mapId: '84a43dd24922060d', 
        }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={handleApiLoaded}
      >
        {stations.map((station) => (
          <Marker
            key={station.id}
            lat={station.lat}
            lng={station.lng}
            text={station.name}
            onClick={() => handleMarkerClick(station.id)}
          />
        ))}
      </GoogleMapReact>
    </div>
  );
}
