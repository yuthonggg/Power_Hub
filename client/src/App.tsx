import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { EnergyProvider } from "./contexts/EnergyContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Prosumer pages
import ProsumerDashboard from "./pages/ProsumerDashboard";
import ProsumerExports from "./pages/ProsumerExports";
import ProsumerEarnings from "./pages/ProsumerEarnings";
import ProsumerProfile from "./pages/ProsumerProfile";

// Consumer pages
import ConsumerDashboard from "./pages/ConsumerDashboard";
import ConsumerPlans from "./pages/ConsumerPlans";
import ConsumerUsage from "./pages/ConsumerUsage";
import ConsumerProfile from "./pages/ConsumerProfile";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminPricing from "./pages/AdminPricing";
import AdminUsers from "./pages/AdminUsers";
import AdminInventory from "./pages/AdminInventory";
import DemoSelector from "./pages/DemoSelector";

function Router() {
  return (
    <Switch>
      {/* Demo mode */}
      <Route path={"/demo"} component={DemoSelector} />
      
      {/* Public pages */}
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/register"} component={Register} />

      {/* Prosumer pages */}
      <Route path={"/prosumer"} component={ProsumerDashboard} />
      <Route path={"/prosumer/exports"} component={ProsumerExports} />
      <Route path={"/prosumer/earnings"} component={ProsumerEarnings} />
      <Route path={"/prosumer/profile"} component={ProsumerProfile} />

      {/* Consumer pages */}
      <Route path={"/consumer"} component={ConsumerDashboard} />
      <Route path={"/consumer/plans"} component={ConsumerPlans} />
      <Route path={"/consumer/usage"} component={ConsumerUsage} />
      <Route path={"/consumer/profile"} component={ConsumerProfile} />

      {/* Admin pages */}
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/pricing"} component={AdminPricing} />
      <Route path={"/admin/users"} component={AdminUsers} />
      <Route path={"/admin/inventory"} component={AdminInventory} />

      {/* 404 */}
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <EnergyProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </EnergyProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
