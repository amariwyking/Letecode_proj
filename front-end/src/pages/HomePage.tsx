import React from 'react'
import DateDisplay from '../components/DateDisplay'
import Map from '../components/Map';

const HomePage: React.FC = () => {
    const defaultCenter = { lat: 40.7128, lng: -74.0060 };
    const defaultZoom = 11;
    return (
        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <h1 style={{ fontSize: '4em' }}>Hello world!</h1>
            <h1>NYC Transit Map</h1>
            <Map center={defaultCenter} zoom={defaultZoom} />
            <DateDisplay />
        </div>
    )
}

export default HomePage
