import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Spot } from "@shared/schema";

type SpotFilters = {
  difficulty: string;
  bestSeason: string;
  minElevation: number;
  maxElevation: number;
};

type SpotFiltersProps = {
  onFiltersChange: (spots: Spot[]) => void;
  spots: Spot[];
};

const DIFFICULTIES = {
  all: "all",
  easy: "facile",
  intermediate: "intermédiaire",
  advanced: "avancé",
  expert: "expert",
} as const;

const SEASONS = {
  all: "all",
  winter: "hiver",
  spring: "printemps",
  summer: "été",
  fall: "automne",
} as const;

export function SpotFilters({ onFiltersChange, spots }: SpotFiltersProps) {
  const [filters, setFilters] = useState<SpotFilters>({
    difficulty: DIFFICULTIES.all,
    bestSeason: SEASONS.all,
    minElevation: 0,
    maxElevation: 5000,
  });

  const applyFilters = (newFilters: Partial<SpotFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    const filteredSpots = spots.filter((spot) => {
      if (updatedFilters.difficulty !== DIFFICULTIES.all && spot.difficulty !== updatedFilters.difficulty) {
        return false;
      }
      if (updatedFilters.bestSeason !== SEASONS.all && spot.bestSeason !== updatedFilters.bestSeason) {
        return false;
      }
      if (spot.elevation < updatedFilters.minElevation || spot.elevation > updatedFilters.maxElevation) {
        return false;
      }
      return true;
    });

    onFiltersChange(filteredSpots);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtres</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Difficulté</Label>
          <Select
            value={filters.difficulty}
            onValueChange={(value) => applyFilters({ difficulty: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Toutes les difficultés" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DIFFICULTIES.all}>Toutes</SelectItem>
              <SelectItem value={DIFFICULTIES.easy}>Facile</SelectItem>
              <SelectItem value={DIFFICULTIES.intermediate}>Intermédiaire</SelectItem>
              <SelectItem value={DIFFICULTIES.advanced}>Avancé</SelectItem>
              <SelectItem value={DIFFICULTIES.expert}>Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Saison</Label>
          <Select
            value={filters.bestSeason}
            onValueChange={(value) => applyFilters({ bestSeason: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Toutes les saisons" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SEASONS.all}>Toutes</SelectItem>
              <SelectItem value={SEASONS.winter}>Hiver</SelectItem>
              <SelectItem value={SEASONS.spring}>Printemps</SelectItem>
              <SelectItem value={SEASONS.summer}>Été</SelectItem>
              <SelectItem value={SEASONS.fall}>Automne</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Altitude min. (m)</Label>
            <Input
              type="number"
              value={filters.minElevation}
              onChange={(e) => applyFilters({ minElevation: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label>Altitude max. (m)</Label>
            <Input
              type="number"
              value={filters.maxElevation}
              onChange={(e) => applyFilters({ maxElevation: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}