import { useState } from "react";
import { Version } from "@/services/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Clock, Code, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface VersionsTabProps {
  versions: Version[];
}

export default function VersionsTab({ versions }: VersionsTabProps) {
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(
    versions.length > 0 ? versions[0] : null
  );
  const [isVersionListOpen, setIsVersionListOpen] = useState(false);

  const formatLocalTime = (dateString: string) => {
    const utcDate = new Date(dateString);
    const timezoneOffset = utcDate.getTimezoneOffset();
    const localDate = new Date(utcDate.getTime() - timezoneOffset * 60000);
    return format(localDate, "MMM d, yyyy HH:mm");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full px-4 lg:px-6"
    >
      {/* Mobile Version List Toggle */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          onClick={() => setIsVersionListOpen(!isVersionListOpen)}
          className="w-full flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Version History
          </span>
          {isVersionListOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Version List */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={cn(
          "lg:col-span-1",
          isVersionListOpen ? "block" : "hidden lg:block"
        )}
      >
        <Card className="overflow-hidden border border-border bg-card shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
              <FileText className="h-5 w-5 text-muted-foreground" />
              Version History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-16rem)] lg:h-[calc(100vh-16rem)]">
              <div className="p-4 space-y-2">
                {versions.length > 0 ? (
                  versions.map((version, index) => (
                    <motion.button
                      key={version.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        setSelectedVersion(version);
                        setIsVersionListOpen(false);
                      }}
                      className={cn(
                        "w-full text-left p-3 rounded-lg transition-all group border",
                        selectedVersion?.id === version.id
                          ? "bg-muted border-border text-foreground"
                          : "hover:bg-muted/50 border-border text-muted-foreground"
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              "font-medium",
                              selectedVersion?.id === version.id
                                ? "bg-muted border-border text-foreground"
                                : "bg-muted border-border text-muted-foreground"
                            )}
                          >
                            v{version.number}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground group-hover:text-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatLocalTime(version.created_at)}
                        </div>
                      </div>
                    </motion.button>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-muted-foreground py-8 bg-muted/30 rounded-lg"
                  >
                    No versions available
                  </motion.div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>

      {/* Version Details */}
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-2"
      >
        <Card className="overflow-hidden border border-border bg-card shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
              <Code className="h-5 w-5 text-muted-foreground" />
              {selectedVersion
                ? `Version ${selectedVersion.number} Details`
                : "Version Details"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="p-4 lg:p-6 space-y-6">
                <AnimatePresence mode="wait">
                  {selectedVersion ? (
                    <motion.div
                      key={selectedVersion.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Metadata
                          </h3>
                          <Badge
                            variant="outline"
                            className="bg-muted border-border text-muted-foreground w-fit"
                          >
                            {formatLocalTime(selectedVersion.created_at)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              Version Number
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              v{selectedVersion.number}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              Created At
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {formatLocalTime(selectedVersion.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Separator className="my-6" />

                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          System Prompt
                        </h3>
                        <div className="p-4 bg-muted/30 rounded-lg border border-border">
                          <pre className="font-mono text-sm whitespace-pre-wrap text-foreground">
                            {selectedVersion.system_prompt}
                          </pre>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-muted-foreground py-8 bg-muted/30 rounded-lg"
                    >
                      Select a version to view details
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
