import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Departments from "./pages/Departments";
import Reports from "./pages/Reports";
import Review from "./pages/Review";
import Approvals from "./pages/Approvals";
import Notifications from "./pages/Notifications";
import Search from "./pages/Search";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {
        /* create router and pass future flags to RouterProvider so runtime picks them up */
      }
      {(() => {
        const router = createBrowserRouter([
          { path: "/", element: <Navigate to="/login" replace /> },
          { path: "/login", element: <Login /> },
          { path: "/signup", element: <Signup /> },
          {
            element: <DashboardLayout />,
            children: [
              { path: "/dashboard", element: <Dashboard /> },
              { path: "/departments", element: <Departments /> },
              { path: "/reports", element: <Reports /> },
              { path: "/review", element: <Review /> },
              { path: "/approvals", element: <Approvals /> },
              { path: "/notifications", element: <Notifications /> },
              { path: "/search", element: <Search /> },
              { path: "/settings", element: <Settings /> }
            ]
          },
          { path: "*", element: <NotFound /> }
        ]);
        return <RouterProvider router={router} future={( { v7_startTransition: true, v7_relativeSplatPath: true } as any )} />;
      })()}
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
