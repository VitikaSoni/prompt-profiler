import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../ui/card";
import { TestCase, testCasesApi } from "@/services/api/testCases";

interface TestCasesProps {
  promptId: number;
}

export default function TestCases({ promptId }: TestCasesProps) {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(
    null
  );
  const [newTestCase, setNewTestCase] = useState<
    Omit<TestCase, "id" | "prompt_id">
  >({
    user_message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (promptId) {
      fetchTestCases();
    }
  }, [promptId]);

  const fetchTestCases = async () => {
    if (!promptId) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await testCasesApi.getAllTestCases(promptId);
      setTestCases(data);
    } catch (error) {
      console.error("Error fetching test cases:", error);
      setError("Failed to fetch test cases");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!promptId) return;

    try {
      const data = await testCasesApi.createTestCase(promptId, newTestCase);
      setTestCases([...testCases, data]);
      setNewTestCase({ user_message: "" });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating test case:", error);
      setError("Failed to create test case");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await testCasesApi.deleteTestCase(id);
      setTestCases(testCases.filter((tc) => tc.id !== id));
    } catch (error) {
      console.error("Error deleting test case:", error);
      setError("Failed to delete test case");
    }
  };

  const openViewDialog = (testCase: TestCase) => {
    setSelectedTestCase(testCase);
    setIsViewDialogOpen(true);
  };

  if (!promptId) {
    return <div className="text-muted-foreground">No prompt selected</div>;
  }

  if (error) {
    return <div className="text-destructive">{error}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-x-auto px-6">
        <div className="flex gap-4 py-4 min-w-full">
          <Card
            className="w-[180px] h-[150px] flex flex-col hover:shadow-lg transition-shadow cursor-pointer flex-shrink-0 border-dashed border-border"
            onClick={() => setIsDialogOpen(true)}
          >
            <div className="flex flex-col flex-1 items-center justify-center">
              <Plus className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Add Test Case</p>
            </div>
          </Card>
          {testCases.map((testCase) => (
            <Card
              key={testCase.id}
              className="w-[180px] h-[150px] flex flex-col hover:shadow-lg transition-shadow cursor-pointer flex-shrink-0 border-border"
              onClick={() => openViewDialog(testCase)}
            >
              <div className="flex flex-col flex-1">
                <CardContent className="flex-1 overflow-hidden mt-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {testCase.user_message}
                  </p>
                </CardContent>

                <CardFooter className="flex justify-end p-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(testCase.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Add New Test Case Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Add New Test Case
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                User Message
              </label>
              <Textarea
                value={newTestCase.user_message}
                onChange={(e) =>
                  setNewTestCase((prev) => ({
                    ...prev,
                    user_message: e.target.value,
                  }))
                }
                placeholder="Enter user message..."
                className="min-h-[100px] bg-muted border-border text-foreground placeholder-muted-foreground"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!newTestCase.user_message.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              Add Test Case
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Test Case Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Test Case {selectedTestCase?.id}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                User Message
              </label>
              <div className="min-h-[200px] p-4 bg-muted rounded-md whitespace-pre-wrap text-sm text-foreground">
                {selectedTestCase?.user_message}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
