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
      const prompts = await promptsApi.getAllPrompts();
      const foundPrompt = prompts.find((p) => p.id === parseInt(id!));
      if (foundPrompt) {
        setPrompt(foundPrompt);
        // Fetch current version's system prompt
        try {
          const currentVersion = await versionsApi.getCurrentVersion(
            foundPrompt.id
          );
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
            foundPrompt.id
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
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-[500px] w-full" />
        </div>
      </div>
    );
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
    <div className="mx-auto px-10 py-4 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/prompts/${id}`}>
              {prompt.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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

        <TabsContent value="editor" className="mt-0">
          <EditorTab
            versionNumber={versionNumber}
            promptId={Number(id)}
            initialSystemPrompt={systemPrompt}
            onSave={handleSaveSystemPrompt}
          />
        </TabsContent>

        <TabsContent value="versions" className="mt-0">
          <VersionsTab versions={versions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
