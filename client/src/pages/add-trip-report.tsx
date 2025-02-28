import { useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { TripReportForm } from "@/components/trip-report-form";
import type { InsertTripReport } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AddTripReport() {
  const [, navigate] = useLocation();
  const { id } = useParams();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: InsertTripReport) => {
      const res = await apiRequest("POST", `/api/spots/${id}/reports`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Trip report added successfully",
      });
      navigate(`/spots/${id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add Trip Report</h1>
      <div className="max-w-2xl">
        <TripReportForm 
          spotId={parseInt(id!)} 
          onSubmit={(data) => mutation.mutate(data)} 
          isSubmitting={mutation.isPending} 
        />
      </div>
    </div>
  );
}
