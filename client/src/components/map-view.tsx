import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "wouter";
import type { Spot, TripReport } from "@shared/schema";
import { parseGpx } from "@/lib/gpx-parser";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";

type MapViewProps = {
  spots: Spot[] | Spot;
  tripReports?: TripReport[];
  className?: string;
};

export function MapView({ spots, tripReports = [], className }: MapViewProps) {
  const [enabledTracks, setEnabledTracks] = useState<Record<number, boolean>>({});
  const spotsArray = Array.isArray(spots) ? spots : [spots];

  // Calculate map center based on spot(s)
  const center = spotsArray.length === 1 
    ? [spotsArray[0].location.lat, spotsArray[0].location.lng] 
    : [46.5, 7.0]; // Default to Swiss Alps for multiple spots

  return (
    <div className="space-y-4">
      <MapContainer
        center={center as [number, number]}
        zoom={spotsArray.length === 1 ? 12 : 8}
        className={`h-[600px] ${className}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {spotsArray.map((spot) => (
          <Marker key={spot.id} position={[spot.location.lat, spot.location.lng]}>
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{spot.name}</h3>
                <p className="text-sm text-muted-foreground">{spot.difficulty}</p>
                {Array.isArray(spots) && (
                  <Link href={`/spots/${spot.id}`}>
                    <a className="text-sm text-primary hover:underline">View Details</a>
                  </Link>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        {tripReports.map((report) => 
          report.gpxTrack && enabledTracks[report.id] && (
            <Polyline
              key={report.id}
              positions={parseGpx(report.gpxTrack)}
              pathOptions={{ color: 'blue', weight: 3, opacity: 0.7 }}
            />
          )
        )}
      </MapContainer>

      {tripReports.length > 0 && (
        <div className="bg-card p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Trip Report Tracks</h3>
          <div className="space-y-2">
            {tripReports.map((report) => 
              report.gpxTrack && (
                <div key={report.id} className="flex items-center space-x-2">
                  <Switch
                    checked={enabledTracks[report.id] || false}
                    onCheckedChange={(checked) => 
                      setEnabledTracks(prev => ({ ...prev, [report.id]: checked }))
                    }
                  />
                  <Label>{report.title} ({new Date(report.date).toLocaleDateString()})</Label>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}