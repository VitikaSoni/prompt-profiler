import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "@/components/ui/label";
import TestCases from "../other/TestCases";
import { useToast } from "@/components/ui/use-toast";
import { Play, Save, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { runApi, RunResult } from "@/services/api/run";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 md:px-4 h-full md:h-[calc(100vh-160px)] overflow-y-auto md:overflow-hidden"
    >
      {/* Left Column - System Prompt and Test Cases */}
      <div className="flex flex-col h-full space-y-4 md:space-y-6 overflow-hidden">
        {/* System Prompt Section - Fixed */}
        <Card className="border border-border bg-card shadow-lg flex-1 flex flex-col">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex-1 flex flex-col"
          >
            <CardHeader className="pb-2 md:pb-4 flex-shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="text-lg md:text-xl font-semibold tracking-tight text-foreground">
                    System Prompt
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm md:text-base text-muted-foreground">
                    Define the behavior and constraints for your AI assistant
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className="bg-muted text-muted-foreground border-border w-fit"
                >
                  Version {versionNumber}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 flex flex-col min-h-0">
                <Textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="font-mono resize-none text-sm flex-1 min-h-[200px] md:min-h-0 bg-muted border-border text-foreground placeholder-muted-foreground focus:border-primary"
                  placeholder="Enter your system prompt here..."
                />
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveSystemPrompt}
                    disabled={!hasChanges}
                    className="flex items-center gap-2 w-full sm:w-auto"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleRun}
                    disabled={isRunning}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white w-full sm:w-auto"
                  >
                    <Play className="h-4 w-4" />
                    {isRunning ? "Running..." : "Run Tests"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </motion.div>
        </Card>

        {/* Test Cases Section - Scrollable */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border border-border bg-card shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
                Test Cases
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Evaluate your system prompt against these test scenarios
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-full overflow-hidden">
                <TestCases promptId={promptId} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Right Column - Run Results */}
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col h-full overflow-hidden"
      >
        <Card className="flex-1 border border-border bg-card shadow-lg flex flex-col overflow-hidden">
          <CardHeader className="pb-2 md:pb-4 flex-shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-lg md:text-xl font-semibold tracking-tight text-foreground">
                  Test Results
                </CardTitle>
                <CardDescription className="text-sm md:text-base text-muted-foreground">
                  View the output of your system prompt against test cases
                </CardDescription>
              </div>
              <AnimatePresence>
                {isResultsOutdated && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                  >
                    <Badge
                      variant="secondary"
                      className="bg-yellow-900/50 text-yellow-300 border-yellow-700 flex items-center gap-1 w-fit"
                    >
                      <AlertCircle className="h-3 w-3" />
                      Results outdated
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <AnimatePresence mode="wait">
              {runResults ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {runResults.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg border border-border bg-muted"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground mb-2">
                            Test Case {index + 1}
                          </h4>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Input
                              </p>
                              <p className="text-sm text-foreground mt-1">
                                {result.user_message}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Output
                              </p>
                              <p className="text-sm text-foreground mt-1">
                                {result.output}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full text-muted-foreground"
                >
                  <p>Run tests to see results</p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
