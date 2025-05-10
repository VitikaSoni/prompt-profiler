import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./contexts/AuthContext";
import Prompt from "./pages/Prompt";
import TopBar from "./components/TopBar";
import Loading from "./components/other/Loading";
import Landing from "./pages/Landing";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated === null) {
    return <Loading />;
  }
  return isAuthenticated ? (
    <div className="pt-16">{children}</div>
  ) : (
    <Navigate to="/login" />
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/prompts/:id"
        element={
          <PrivateRoute>
            <Prompt />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
