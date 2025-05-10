import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Prompt as PromptInterface,
  Version,
  promptsApi,
  versionsApi,
} from "../services/api";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import EditorTab from "@/components/other/EditorTab";
import VersionsTab from "@/components/other/VersionsTab";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, History } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "@/components/other/Loading";

export default function Prompt() {
  const { id } = useParams<{ id: string }>();
  const [prompt, setPrompt] = useState<PromptInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [versionNumber, setVersionNumber] = useState(0);
  const [versions, setVersions] = useState<Version[]>([]);
  const [activeTab, setActiveTab] = useState("editor");
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchPrompt();
    }
  }, [id]);

  const fetchPrompt = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const prompt = await promptsApi.getPrompt(parseInt(id!));
      if (prompt) {
        setPrompt(prompt);
        // Fetch current version's system prompt
        try {
          const currentVersion = await versionsApi.getCurrentVersion(prompt.id);
          if (currentVersion) {
            setSystemPrompt(currentVersion.system_prompt);
            setVersionNumber(currentVersion.number);
          }
        } catch (error) {
          console.error("Error fetching current version:", error);
          // If no versions exist yet, that's okay - we'll start with an empty prompt
        }
        // Fetch all versions
        try {
          const allVersions = await versionsApi.getVersionsByPromptId(
            prompt.id
          );
          setVersions(allVersions);
        } catch (error) {
          console.error("Error fetching versions:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching prompt:", error);
      setError("Failed to fetch prompt");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSystemPrompt = async (newSystemPrompt: string) => {
    if (!id) return;
    await versionsApi.createVersion(parseInt(id), newSystemPrompt);
    // Refresh versions list
    const allVersions = await versionsApi.getVersionsByPromptId(parseInt(id));
    setVersions(allVersions);
    setSystemPrompt(newSystemPrompt);
    toast({
      title: "Success",
      description: "System prompt saved as new version",
    });
    setVersionNumber((prev) => prev + 1);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-gray-500 text-center py-8">Prompt not found</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto px-4 py-4 space-y-6"
    >
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0">
          <TabsTrigger
            value="editor"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none text-lg data-[state=active]:text-blue-500 data-[state=active]:font-semibold flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" />
            Editor
          </TabsTrigger>
          <TabsTrigger
            value="versions"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none text-lg data-[state=active]:text-blue-500 data-[state=active]:font-semibold flex items-center gap-2"
          >
            <History className="h-4 w-4" />
            Versions
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="editor" className="mt-0">
            <motion.div
              key="editor"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <EditorTab
                versionNumber={versionNumber}
                promptId={Number(id)}
                initialSystemPrompt={systemPrompt}
                onSave={handleSaveSystemPrompt}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="versions" className="mt-0">
            <motion.div
              key="versions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <VersionsTab versions={versions} />
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );
}
