import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { NavHeader } from "@/components/nav-header";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AddSpot from "@/pages/add-spot";
import SpotDetails from "@/pages/spot-details";
import AddTripReport from "@/pages/add-trip-report";
import Auth from "@/pages/auth";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <ProtectedRoute path="/add-spot" component={AddSpot} />
      <Route path="/spots/:id" component={SpotDetails} />
      <ProtectedRoute path="/spots/:id/add-report" component={AddTripReport} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <NavHeader />
          <main className="flex-1">
            <Router />
          </main>
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;