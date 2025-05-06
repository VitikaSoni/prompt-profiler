import { useState } from "react";
import { Version } from "@/services/api";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface VersionsTabProps {
  versions: Version[];
}

export default function VersionsTab({ versions }: VersionsTabProps) {
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(
    versions.length > 0 ? versions[0] : null
  );

  const formatLocalTime = (dateString: string) => {
    const utcDate = new Date(dateString);
    const timezoneOffset = utcDate.getTimezoneOffset();
    const localDate = new Date(utcDate.getTime() - timezoneOffset * 60000);
    return format(localDate, "MMM d, yyyy HH:mm");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      {/* Version List */}
      <Card className="lg:col-span-1 overflow-hidden">
        <div className="border-b p-4 font-semibold text-lg">
          Version History
        </div>
        <ScrollArea className="h-full">
          <div className="p-4 space-y-3">
            {versions.length > 0 ? (
              versions.map((version) => (
                <button
                  key={version.id}
                  onClick={() => setSelectedVersion(version)}
                  className={cn(
                    "w-full text-left p-3 rounded-md transition-all group",
                    selectedVersion?.id === version.id
                      ? "bg-primary/10 border border-primary text-primary"
                      : "hover:bg-muted/50 border border-transparent"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <div className="font-medium">v{version.number}</div>
                    <div className="text-xs text-muted-foreground group-hover:text-foreground">
                      {formatLocalTime(version.created_at)}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No versions available.
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Version Details */}
      <Card className="lg:col-span-2 overflow-hidden">
        <div className="border-b p-4 font-semibold text-lg">
          {selectedVersion
            ? `Details for v${selectedVersion.number}`
            : "Version Details"}
        </div>
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {selectedVersion ? (
              <>
                <div className="space-y-2">
                  <h3 className="text-md font-semibold">Metadata</h3>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      <strong>Version:</strong> {selectedVersion.number}
                    </p>
                    <p>
                      <strong>Created At:</strong>{" "}
                      {formatLocalTime(selectedVersion.created_at)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-md font-semibold">System Prompt</h3>
                  <div className="p-4 bg-muted/50 rounded-md font-mono text-sm whitespace-pre-wrap">
                    {selectedVersion.system_prompt}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                Select a version to view its details.
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
