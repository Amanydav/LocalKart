import React, { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
  LayersControl,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Props = { onLocationSelect: (address: string) => void };

const markerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
  iconSize: [35, 45],
  iconAnchor: [17, 45],
});

const MapPicker: React.FC<Props> = ({ onLocationSelect }) => {
  const [position, setPosition] = useState<[number, number]>([28.6139, 77.209]);
  const [searchText, setSearchText] = useState('');

  /* ── helpers */
  const reverseGeocode = (lat: number, lon: number) =>
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    )
      .then((r) => r.json())
      .then((d) => onLocationSelect(d.display_name || `Lat:${lat},Lng:${lon}`))
      .catch(() => onLocationSelect(`Lat:${lat},Lng:${lon}`));

  const handleSearch = () => {
    if (!searchText.trim()) return;
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchText
      )}`
    )
      .then((r) => r.json())
      .then((d) => {
        if (!d.length) return alert('Location not found');
        const lat = +d[0].lat,
          lon = +d[0].lon;
        setPosition([lat, lon]);
        onLocationSelect(d[0].display_name || searchText);
      })
      .catch(() => alert('Search error'));
  };

  const handleCurrent = () =>
    navigator.geolocation
      ? navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            setPosition([coords.latitude, coords.longitude]);
            reverseGeocode(coords.latitude, coords.longitude);
          },
          () => alert('Unable to get location')
        )
      : alert('Geolocation not supported');

  /* ── Leaflet hooks */
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
    const m = useMap();
    m.setView(position, m.getZoom());
    return null;
  };

  /* ── render */
  return (
    <div className="space-y-4 w-full">
      {/* controls */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search location…"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500"
        />
        <button onClick={handleSearch} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition">
          🔍 Search
        </button>
        <button onClick={handleCurrent} className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition">
          📍 Current
        </button>
      </div>

      {/* map */}
      <div className="w-full h-[350px] rounded-xl border-2 border-blue-200 shadow-lg overflow-hidden">
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Street">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellite">
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="Tiles © Esri"/>
            </LayersControl.BaseLayer>
          </LayersControl>
          <MapRefresher />
          <LocationMarker />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPicker;
