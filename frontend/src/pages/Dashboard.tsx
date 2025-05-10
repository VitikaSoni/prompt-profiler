import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Prompt } from "../services/api";
import PromptCard from "../components/cards/PromptCard";
import AddPromptCard from "../components/cards/AddPromptCard";
import AddPromptModal from "../components/modals/AddPromptModal";
import { promptsApi } from "../services/api";

export default function Dashboard() {
  const { user, logout } = useAuth();
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
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className=" mx-auto px-4 sm:px-6 lg:px-10 py-4">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.displayName}!
              </h1>
              <p className="text-gray-500 mt-1">
                Manage your prompts and create new ones
              </p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                  clipRule="evenodd"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Prompts Grid Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Prompts
            </h2>
            <div className="text-sm text-gray-500">
              {prompts.length} {prompts.length === 1 ? "prompt" : "prompts"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AddPromptCard onClick={() => setIsModalOpen(true)} />
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onDelete={handleDeletePrompt}
                onRename={handleRenamePrompt}
              />
            ))}
          </div>

          {prompts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No prompts yet
              </h3>
              <p className="text-gray-500">
                Click the + card to create your first prompt
              </p>
            </div>
          )}
        </div>
      </div>

      <AddPromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreatePrompt}
      />
    </div>
  );
}
