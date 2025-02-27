import { useQuery } from "@tanstack/react-query";
import { MapView } from "@/components/map-view";
import type { Spot } from "@shared/schema";

export default function Home() {
  const { data: spots, isLoading } = useQuery<Spot[]>({
    queryKey: ["/api/spots"],
  });

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
        <h1 className="text-4xl font-bold mb-2">Discover Ski Touring Spots</h1>
        <p className="text-muted-foreground mb-8">
          Explore and share the best ski touring locations
        </p>
        <MapView spots={spots || []} className="rounded-lg shadow-lg" />
      </div>
    </div>
  );
}
