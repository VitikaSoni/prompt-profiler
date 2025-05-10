import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AppRoutes from "@/routes";
import TopBar from "./components/TopBar";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TopBar />
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
