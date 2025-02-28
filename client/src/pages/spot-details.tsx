import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import type { Spot, TripReport } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mountain, Calendar, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GpxTrackMap } from "@/components/gpx-track-map";

export default function SpotDetails() {
  const { id } = useParams();

  const { data: spot, isLoading: isLoadingSpot } = useQuery<Spot>({
    queryKey: [`/api/spots/${id}`],
  });

  const { data: reports, isLoading: isLoadingReports } = useQuery<TripReport[]>({
    queryKey: [`/api/spots/${id}/reports`],
  });

  if (isLoadingSpot || isLoadingReports) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!spot) {
    return <div>Spot not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">{spot.name}</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Mountain className="h-5 w-5 text-primary" />
                <span>Difficulty: {spot.difficulty}</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowUp className="h-5 w-5 text-primary" />
                <span>Elevation: {spot.elevation}m</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Best Season: {spot.bestSeason}</span>
              </div>
              <p className="text-muted-foreground">{spot.description}</p>
              <p className="mt-4">Access: {spot.access}</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Trip Reports</h2>
            <Link href={`/spots/${id}/add-report`}>
              <Button>Add Trip Report</Button>
            </Link>
          </div>

          {reports?.length === 0 && (
            <p className="text-muted-foreground">No trip reports yet. Be the first to add one!</p>
          )}

          {reports?.map((report) => (
            <Card key={report.id} className="mb-8">
              <CardHeader>
                <CardTitle>{report.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {new Date(report.date).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{report.description}</p>
                <p className="text-sm mt-2">Conditions: {report.conditions}</p>
                {report.gpxTrack && (
                  <>
                    <GpxTrackMap gpxData={report.gpxTrack} className="mt-4 rounded-lg overflow-hidden" />
                    <Button variant="outline" className="mt-2" asChild>
                      <a href={`data:application/gpx+xml,${encodeURIComponent(report.gpxTrack)}`} download="track.gpx">
                        Download GPX Track
                      </a>
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}