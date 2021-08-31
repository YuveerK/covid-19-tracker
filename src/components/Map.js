import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'

import React from 'react'

const Map = ({data }) => {
    console.log(data)
    return (
        <MapContainer center={[51.505, -0.09]} zoom={5} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {data.map ((country) => (
            
            <CircleMarker 
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            pathOptions={{ color: 'red' }}
            radius={Math.sqrt(country.cases) / 100 }
            
            
            >
                
                
            </CircleMarker>

            ))}
            
        </MapContainer>
    )
}

export default Map
