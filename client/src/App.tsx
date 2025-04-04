import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import NotFound from "@/pages/not-found";
import AppLayout from "@/components/layout/app-layout";
import AuthPage from "@/pages/auth-page";
import BuildsPage from "@/pages/builds/index";
import NewBuildPage from "@/pages/builds/new";
import BuildDetailPage from "@/pages/builds/[id]";
import SettingsPage from "@/pages/settings";
import StatsPage from "@/pages/stats";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider, useAuth } from "./hooks/use-auth";

function Router() {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();
  
  // Use useEffect for navigation to avoid React warnings
  useEffect(() => {
    if (!isLoading && !user && location === "/") {
      setLocation("/auth");
    }
  }, [user, isLoading, location, setLocation]);
  
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={() => (
        <AppLayout>
          <BuildsPage />
        </AppLayout>
      )} />
      <ProtectedRoute path="/builds" component={() => (
        <AppLayout>
          <BuildsPage />
        </AppLayout>
      )} />
      <ProtectedRoute path="/builds/new" component={() => (
        <AppLayout>
          <NewBuildPage />
        </AppLayout>
      )} />
      <ProtectedRoute path="/builds/:id" component={() => (
        <AppLayout>
          <BuildDetailPage />
        </AppLayout>
      )} />
      <ProtectedRoute path="/settings" component={() => (
        <AppLayout>
          <SettingsPage />
        </AppLayout>
      )} />
      <ProtectedRoute path="/stats" component={() => (
        <AppLayout>
          <StatsPage />
        </AppLayout>
      )} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
