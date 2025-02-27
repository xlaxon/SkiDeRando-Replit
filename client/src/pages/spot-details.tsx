import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import type { Spot, TripReport } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mountain, Calendar, ArrowUp } from "lucide-react";

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
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Trip Reports</h2>
          {reports?.map((report) => (
            <Card key={report.id} className="mb-4">
              <CardHeader>
                <CardTitle>{report.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{report.description}</p>
                <p className="text-sm mt-2">Conditions: {report.conditions}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
