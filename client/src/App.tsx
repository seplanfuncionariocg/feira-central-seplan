import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch } from "wouter";
import { useEffect, useState } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";


// Custom hook to handle GitHub Pages routing
const useGitHubPagesLocation = () => {
  const [location, setLocation] = useState(() => {
    const path = window.location.pathname;
    // Remove base path if present
    return path.replace(/^\/feira-central-seplan/, '') || '/';
  });

  const navigate = (to: string) => {
    const newPath = `/feira-central-seplan${to}`;
    window.history.pushState(null, '', newPath);
    setLocation(to);
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setLocation(path.replace(/^\/feira-central-seplan/, '') || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return [location, navigate] as const;
};

function Router() {
  return (
    <WouterRouter hook={useGitHubPagesLocation}>
      <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
