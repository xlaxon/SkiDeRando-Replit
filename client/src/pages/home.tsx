import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { MapView } from "@/components/map-view";
import { SpotFilters } from "@/components/spot-filters";
import type { Spot } from "@shared/schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mountain, ArrowUp, Calendar } from "lucide-react";

export default function Home() {
  const { data: spots, isLoading } = useQuery<Spot[]>({
    queryKey: ["/api/spots"],
  });

  const [filteredSpots, setFilteredSpots] = useState<Spot[]>([]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">Découvrez les Spots de Ski de Randonnée</h1>
        <p className="text-muted-foreground mb-8">
          Explorez et partagez les meilleurs spots
        </p>

        <div className="grid lg:grid-cols-[300px,1fr] gap-8">
          <div>
            <SpotFilters
              spots={spots || []}
              onFiltersChange={setFilteredSpots}
            />
          </div>

          <div className="space-y-8">
            <MapView
              spots={filteredSpots.length > 0 ? filteredSpots : spots || []}
              className="rounded-lg shadow-lg"
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(filteredSpots.length > 0 ? filteredSpots : spots || []).map((spot) => (
                <Link key={spot.id} href={`/spots/${spot.id}`}>
                  <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                    <CardHeader>
                      <CardTitle>{spot.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mountain className="h-4 w-4 text-primary" />
                        <span>Difficulté: {spot.difficulty}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <ArrowUp className="h-4 w-4 text-primary" />
                        <span>Altitude: {spot.elevation}m</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>Meilleure saison: {spot.bestSeason}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {spot.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}