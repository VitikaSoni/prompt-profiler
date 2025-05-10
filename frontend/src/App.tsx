import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Prompt from "./pages/Prompt";
import TopBar from "./components/TopBar";
import Loading from "./components/other/Loading";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated === null) {
    return <Loading />;
  }
  return isAuthenticated ? (
    <>
      <TopBar />
      <div className="pt-16">{children}</div>
    </>
  ) : (
    <Navigate to="/login" />
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
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
    </AuthProvider>
  );
}

export default App;
