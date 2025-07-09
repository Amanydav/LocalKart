import React, { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Props = {
  onLocationSelect: (address: string) => void;
};

const markerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
  iconSize: [35, 45],
  iconAnchor: [17, 45],
});

const MapPicker: React.FC<Props> = ({ onLocationSelect }) => {
  const [position, setPosition] = useState<[number, number]>([28.6139, 77.2090]); // Default to Delhi
  const [searchText, setSearchText] = useState('');

  const reverseGeocode = (lat: number, lon: number) => {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`)
      .then((res) => res.json())
      .then((data) => {
        onLocationSelect(data.display_name || `Lat: ${lat}, Lng: ${lon}`);
      });
  };

  const handleSearch = () => {
    if (!searchText.trim()) return;
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          setPosition([lat, lon]);
          onLocationSelect(data[0].display_name || searchText);
        } else {
          alert('Location not found');
        }
      })
      .catch(() => alert('Error searching location.'));
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setPosition([lat, lon]);
        reverseGeocode(lat, lon);
      },
      () => {
        alert('Unable to retrieve your location.');
      }
    );
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        reverseGeocode(lat, lng);
      },
    });
    return <Marker position={position} icon={markerIcon} />;
  };

  const MapRefresher = () => {
    const map = useMap();
    map.setView(position, map.getZoom());
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Search and location buttons */}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search location..."
          className="flex-1 px-3 py-2 border rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          🔍 Search
        </button>
        <button
          onClick={handleUseCurrentLocation}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
        >
          📍 Use Current Location
        </button>
      </div>

      {/* Map */}
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '350px', borderRadius: '10px' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapRefresher />
        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default MapPicker;
