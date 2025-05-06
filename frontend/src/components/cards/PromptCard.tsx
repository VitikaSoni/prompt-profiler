import { Prompt } from "@/services/api";
import { useState } from "react";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import RenamePromptModal from "../modals/RenamePromptModal";
import { formatDate } from "../../utils/date";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "../ui/card";

interface PromptCardProps {
  prompt: Prompt;
  onDelete: (id: number) => void;
  onRename: (id: number, newName: string) => Promise<void>;
}

export default function PromptCard({
  prompt,
  onDelete,
  onRename,
}: PromptCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpen = () => {
    navigate(`/prompts/${prompt.id}`);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Card className="w-full h-[180px] cursor-pointer flex flex-col">
            <CardHeader className="flex-none">
              <CardTitle className="line-clamp-1">{prompt.name}</CardTitle>
            </CardHeader>
            <div className="mt-auto ml-auto text-sm text-gray-500 p-4">
              Created at {formatDate(prompt.created_at)}
            </div>
          </Card>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleOpen}>Open</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsRenameModalOpen(true)}>
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-red-600"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => onDelete(prompt.id)}
        title="Delete Prompt"
        message="Are you sure you want to delete this prompt? This action cannot be undone."
      />

      <RenamePromptModal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        onRename={(newName) => onRename(prompt.id, newName)}
        currentName={prompt.name}
      />
    </>
  );
}
