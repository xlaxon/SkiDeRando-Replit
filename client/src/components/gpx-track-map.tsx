import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import { parseGpx } from "@/lib/gpx-parser";
import "leaflet/dist/leaflet.css";

type GpxTrackMapProps = {
  gpxData: string;
  className?: string;
};

export function GpxTrackMap({ gpxData, className }: GpxTrackMapProps) {
  const coordinates = parseGpx(gpxData);
  
  if (coordinates.length === 0) {
    return null;
  }

  // Calculate the center of the track
  const bounds = coordinates.reduce(
    (acc, [lat, lng]) => ({
      minLat: Math.min(acc.minLat, lat),
      maxLat: Math.max(acc.maxLat, lat),
      minLng: Math.min(acc.minLng, lng),
      maxLng: Math.max(acc.maxLng, lng),
    }),
    {
      minLat: coordinates[0][0],
      maxLat: coordinates[0][0],
      minLng: coordinates[0][1],
      maxLng: coordinates[0][1],
    }
  );

  const center = [
    (bounds.minLat + bounds.maxLat) / 2,
    (bounds.minLng + bounds.maxLng) / 2,
  ];

  return (
    <MapContainer
      center={center as [number, number]}
      zoom={13}
      className={`h-[400px] ${className}`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline
        positions={coordinates}
        color="blue"
        weight={3}
        opacity={0.7}
      />
    </MapContainer>
  );
}
