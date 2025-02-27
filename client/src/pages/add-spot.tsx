import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { SpotForm } from "@/components/spot-form";
import type { InsertSpot } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AddSpot() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: InsertSpot) => {
      const res = await apiRequest("POST", "/api/spots", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Spot added successfully",
      });
      navigate("/");
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
      <h1 className="text-3xl font-bold mb-6">Add New Spot</h1>
      <div className="max-w-2xl">
        <SpotForm onSubmit={(data) => mutation.mutate(data)} isSubmitting={mutation.isPending} />
      </div>
    </div>
  );
}
