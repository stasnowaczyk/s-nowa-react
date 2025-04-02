import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

// Define type for container style
const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '400px',
};

// Define type for center coordinates
interface Center {
    lat: number;
    lng: number;
}

const center: Center = {
    lat: 37.7749, // San Francisco coordinates
    lng: -122.4194,
};

const Map: React.FC = () => {
    return (
        <LoadScript
            googleMapsApiKey="YOUR_API_KEY" // Replace with your actual API key
        >
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
                <Marker position={center} />
            </GoogleMap>
        </LoadScript>
    );
};

export default Map;
