import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Collaborator } from "@/types/script";

interface CollaboratorListProps {
  collaborators: Collaborator[];
  onRemove: (id: string) => void;
}

export const CollaboratorList = ({ collaborators, onRemove }: CollaboratorListProps) => {
  return (
    <div className="space-y-2">
      {collaborators.map((collaborator) => (
        <div
          key={collaborator.id}
          className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <span>{collaborator.email}</span>
            <Badge variant={collaborator.online ? "secondary" : "outline"}>
              {collaborator.online ? "Online" : "Offline"}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(collaborator.id)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};