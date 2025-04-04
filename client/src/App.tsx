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
import EditBuildPage from "@/pages/builds/edit";
import SettingsPage from "@/pages/settings";
import StatsPage from "@/pages/stats";
import { ProtectedRoute } from "./lib/protected-route";
import { PublicRoute } from "./lib/public-route";
import { AuthProvider, useAuth } from "./hooks/use-auth";

function Router() {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();
  
  // Use useEffect for navigation to avoid React warnings
  // We no longer need to redirect unauthenticated users from the home page
  // since we've made the build listing and detail pages public
  
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <PublicRoute path="/" component={() => (
        <AppLayout>
          <BuildsPage />
        </AppLayout>
      )} />
      <PublicRoute path="/builds" component={() => (
        <AppLayout>
          <BuildsPage />
        </AppLayout>
      )} />
      <ProtectedRoute path="/builds/new" component={() => (
        <AppLayout>
          <NewBuildPage />
        </AppLayout>
      )} />
      <ProtectedRoute path="/builds/:id/edit" component={() => (
        <AppLayout>
          <EditBuildPage />
        </AppLayout>
      )} />
      <PublicRoute path="/builds/:id" component={() => (
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
