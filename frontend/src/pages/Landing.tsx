import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { ArrowRight, Code, GitBranch, Zap, Shield, Users } from "lucide-react";

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pt-16">
        {/* Hero Section */}
        <div className="container mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Prompt Profiler
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl">
                A platform for managing, versioning, and testing AI prompts
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  Get Started <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  Go to Dashboard <ArrowRight className="w-5 h-5" />
                </Link>
              )}
              <a
                href="#features"
                className="bg-card hover:bg-accent text-foreground font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105 flex items-center justify-center gap-2 border border-border"
              >
                Learn More
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div id="features" className="container mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tools to help you manage and improve your AI prompts
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-card border border-border p-8 rounded-xl hover:transform hover:scale-105 transition duration-300"
            >
              <div className="text-blue-400 text-4xl mb-4">
                <Code className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">
                Prompt Management
              </h3>
              <p className="text-muted-foreground mb-4">
                Create and organize your AI prompts with an intuitive interface
              </p>
              <ul className="text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Text editor
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Autocomplete
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-card border border-border p-8 rounded-xl hover:transform hover:scale-105 transition duration-300"
            >
              <div className="text-blue-400 text-4xl mb-4">
                <GitBranch className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">
                Version Control
              </h3>
              <p className="text-muted-foreground mb-4">
                Track changes and maintain a history of your prompt iterations
              </p>
              <ul className="text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Version history
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Change tracking
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card border border-border p-8 rounded-xl hover:transform hover:scale-105 transition duration-300"
            >
              <div className="text-blue-400 text-4xl mb-4">
                <Zap className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">
                Testing
              </h3>
              <p className="text-muted-foreground mb-4">
                Test your prompts to ensure they work as expected
              </p>
              <ul className="text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Test case creation
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Response validation
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Start Managing Your AI Prompts
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Create an account to begin organizing and improving your AI
              prompts
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="bg-white text-blue-500 hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-lg transition duration-300 inline-flex items-center justify-center gap-2"
                >
                  Sign Up <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="bg-white text-blue-500 hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-lg transition duration-300 inline-flex items-center justify-center gap-2"
                >
                  Go to Dashboard <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
