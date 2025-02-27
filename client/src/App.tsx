import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { NavHeader } from "@/components/nav-header";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AddSpot from "@/pages/add-spot";
import SpotDetails from "@/pages/spot-details";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/add-spot" component={AddSpot} />
      <Route path="/spots/:id" component={SpotDetails} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <NavHeader />
        <main className="flex-1">
          <Router />
        </main>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
