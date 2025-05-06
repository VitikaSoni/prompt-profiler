import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "@/components/ui/label";
import TestCases from "../other/TestCases";
import { useToast } from "@/components/ui/use-toast";
import { Play, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { runApi, RunResult } from "@/services/api/run";

interface EditorTabProps {
  promptId: number;
  initialSystemPrompt: string;
  versionNumber: number;
  onSave: (systemPrompt: string) => Promise<void>;
}

export default function EditorTab({
  promptId,
  initialSystemPrompt,
  versionNumber,
  onSave,
}: EditorTabProps) {
  const [systemPrompt, setSystemPrompt] = useState(initialSystemPrompt);
  const [runResults, setRunResults] = useState<RunResult[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRunPrompt, setLastRunPrompt] = useState(initialSystemPrompt);
  const { toast } = useToast();

  const isResultsOutdated =
    systemPrompt !== lastRunPrompt && runResults !== null;
  const hasChanges = systemPrompt !== initialSystemPrompt;

  const handleSaveSystemPrompt = async () => {
    try {
      await onSave(systemPrompt);
      toast({
        title: "Success",
        description: "System prompt saved as new version",
      });
    } catch (error) {
      console.error("Error saving system prompt:", error);
      toast({
        title: "Error",
        description: "Failed to save system prompt",
        variant: "destructive",
      });
    }
  };

  const handleRun = async () => {
    try {
      setIsRunning(true);
      setRunResults(null);
      const response = await runApi.runPrompt(promptId, systemPrompt);
      setRunResults(response.results);
      setLastRunPrompt(systemPrompt);
    } catch (error) {
      console.error("Error running prompt:", error);
      toast({
        title: "Error",
        description: "Failed to run prompt",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[calc(100vh-20rem)]">
      {/* Left Column - System Prompt and Test Cases */}
      <div className="flex flex-col h-full">
        {/* System Prompt Section - Fixed */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center ">
              <span className="text-lg font-semibold">System Prompt</span>
              <span className="text-xs text-muted-foreground bg-blue-50 px-2 py-1 text-blue-500 ml-2">
                Editing Version {versionNumber}
              </span>
              <div className="flex gap-2 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveSystemPrompt}
                  disabled={!hasChanges}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save
                </Button>
                <Button
                  size="sm"
                  onClick={handleRun}
                  disabled={isRunning}
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  {isRunning ? "Running..." : "Run"}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="h-[150px] font-mono resize-none"
              placeholder="Enter your system prompt here..."
            />
          </CardContent>
        </Card>

        {/* Test Cases Section - Scrollable */}
        <Card className="flex-1 overflow-hidden">
          <CardHeader className="py-3">
            <CardTitle>Test Cases</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-full overflow-hidden">
              <TestCases promptId={promptId} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Run Results */}
      <div className="flex flex-col h-full overflow-scroll">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Run Results</span>
              {isResultsOutdated && (
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800"
                >
                  Outdated
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-4rem)]">
            {runResults ? (
              <div className="space-y-4">
                {runResults.map((result) => (
                  <Card key={result.test_case_id} className="bg-muted/50">
                    <CardContent className="space-y-3 p-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          User Message
                        </Label>
                        <p className="mt-1 text-sm">{result.user_message}</p>
                      </div>
                      <Separator />
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Output
                        </Label>
                        <p className="mt-1 text-sm font-mono bg-background p-2 rounded">
                          {result.output}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Run the prompt to see results
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
