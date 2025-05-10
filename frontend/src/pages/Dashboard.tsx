import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Prompt } from "../services/api";
import PromptCard from "../components/cards/PromptCard";

import AddPromptModal from "../components/modals/AddPromptModal";
import { promptsApi } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../components/other/Loading";
export default function Dashboard() {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const data = await promptsApi.getAllPrompts();
      setPrompts(data);
    } catch (error) {
      console.error("Error fetching prompts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePrompt = async (name: string) => {
    try {
      const newPrompt = await promptsApi.createPrompt(name);
      setPrompts((prev) => [...prev, newPrompt]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating prompt:", error);
    }
  };

  const handleDeletePrompt = async (id: number) => {
    try {
      await promptsApi.deletePrompt(id);
      setPrompts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting prompt:", error);
    }
  };

  const handleRenamePrompt = async (id: number, newName: string) => {
    try {
      const updatedPrompt = await promptsApi.renamePrompt(id, newName);
      setPrompts((prev) => prev.map((p) => (p.id === id ? updatedPrompt : p)));
    } catch (error) {
      console.error("Error renaming prompt:", error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8 border border-border"
        >
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
              Welcome back, {user?.displayName}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mt-2">
              Manage your prompts and create new ones to enhance your workflow
            </p>
          </div>
        </motion.div>

        {/* Prompts Grid Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-card rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-border"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                Your Prompts
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                {prompts.length} {prompts.length === 1 ? "prompt" : "prompts"}{" "}
                in your collection
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg
                className="h-5 w-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              New Prompt
            </motion.button>
          </div>

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            <AnimatePresence>
              {prompts.map((prompt, index) => (
                <motion.div
                  key={prompt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <PromptCard
                    prompt={prompt}
                    onDelete={handleDeletePrompt}
                    onRename={handleRenamePrompt}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {prompts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="text-center py-8 sm:py-12 lg:py-16"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-muted-foreground mb-4"
                >
                  <svg
                    className="mx-auto h-12 w-12 sm:h-16 sm:w-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </motion.div>
                <h3 className="text-lg sm:text-xl font-medium text-foreground mb-2">
                  No prompts yet
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground max-w-sm mx-auto px-4">
                  Get started by creating your first prompt. Click the "New
                  Prompt" button above to begin.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AddPromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreatePrompt}
      />
    </motion.div>
  );
}
