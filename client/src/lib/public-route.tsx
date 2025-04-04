import { Route } from "wouter";

/**
 * A route that's accessible to everyone - both authenticated and unauthenticated users
 */
export function PublicRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  return (
    <Route path={path}>
      <Component />
    </Route>
  );
}