import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import NotFound from "@/pages/not-found";
import AppLayout from "@/components/layout/app-layout";
import LoginPage from "@/pages/login";
import BuildsPage from "@/pages/builds/index";
import NewBuildPage from "@/pages/builds/new";
import BuildDetailPage from "@/pages/builds/[id]";
import SettingsPage from "@/pages/settings";
import StatsPage from "@/pages/stats";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider, useAuth } from "./hooks/use-auth";

function Router() {
  const { user, isLoading } = useAuth();

  // Show login page if not authenticated
  if (!isLoading && !user) {
    return (
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="*">
          <Route path="*">
            <LoginPage />
          </Route>
        </Route>
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
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
