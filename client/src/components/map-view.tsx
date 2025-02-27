import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "wouter";
import type { Spot } from "@shared/schema";

type MapViewProps = {
  spots: Spot[];
  className?: string;
};

export function MapView({ spots, className }: MapViewProps) {
  return (
    <MapContainer
      center={[46.5, 7.0]} // Centered on Swiss Alps
      zoom={8}
      className={`h-[600px] ${className}`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {spots.map((spot) => (
        <Marker key={spot.id} position={[spot.location.lat, spot.location.lng]}>
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">{spot.name}</h3>
              <p className="text-sm text-muted-foreground">{spot.difficulty}</p>
              <Link href={`/spots/${spot.id}`}>
                <a className="text-sm text-primary hover:underline">View Details</a>
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
