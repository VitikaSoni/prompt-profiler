import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { logos } from "@/assets";
import { motion } from "framer-motion";

export default function Login() {
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await login();
      navigate("/");
    } catch (error) {
      setError("Failed to sign in with Google");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-[90%] sm:max-w-md space-y-6 sm:space-y-8 p-6 sm:p-8 md:p-10 bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-blue-100"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6"
          >
            <motion.img
              src={logos.logo}
              alt="App Logo"
              className="h-12 sm:h-14 md:h-16 w-auto"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            />
            <motion.h1
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#192b53] to-[#4d6eb4] bg-clip-text text-transparent"
            >
              Prompt Profiler
            </motion.h1>
          </motion.div>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-base sm:text-lg text-gray-600 font-medium"
          >
            Your AI Prompt Management Platform
          </motion.p>
        </div>
        {error && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-3 sm:p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg sm:rounded-xl text-sm font-medium"
          >
            {error}
          </motion.div>
        )}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 sm:mt-10 space-y-4 sm:space-y-6"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-blue-200 transition-all duration-200 py-4 sm:py-6 text-sm sm:text-base font-medium rounded-lg sm:rounded-xl shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center text-xs sm:text-sm text-gray-500 mt-2 sm:mt-4"
          >
            Made with ❤️ by{" "}
            <a
              href="https://github.com/vitikasoni"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              Vitika
            </a>
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
