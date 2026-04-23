import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { Navbar } from "@/components/navbar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import HistoryPage from "@/pages/history";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/history" component={HistoryPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="dark min-h-screen bg-background relative overflow-hidden">
      {/* Background Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AuthProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Navbar />
                <Router />
              </WouterRouter>
              <Toaster />
            </AuthProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </div>
    </div>
  );
}

export default App;
