import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, History, Trash } from "lucide-react";
import { Collaborator } from "@/types/script";
import { UseMutationResult } from "@tanstack/react-query";

interface ScriptEditorHeaderProps {
  collaborators: Collaborator[];
  newCollaboratorEmail: string;
  setNewCollaboratorEmail: (email: string) => void;
  handleAddCollaborator: () => Promise<void> | void;
  removeCollaborator: (id: string) => Promise<void> | void;
  setShowHistory: (show: boolean) => void;
  showHistory: boolean;
  updatePermissions: UseMutationResult<any, Error, { read: string[]; write: string[]; admin: string[] }>;
}

const ScriptEditorHeader = ({
  collaborators,
  newCollaboratorEmail,
  setNewCollaboratorEmail,
  handleAddCollaborator,
  removeCollaborator,
  setShowHistory,
  showHistory,
  updatePermissions,
}: ScriptEditorHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle>Script Editor</CardTitle>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Collaborators ({collaborators.length})
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage Collaborators</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Collaborator email"
                    value={newCollaboratorEmail}
                    onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                  />
                  <Button onClick={handleAddCollaborator} size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
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
                        onClick={() => removeCollaborator(collaborator.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="w-4 h-4 mr-2" />
            History
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};

export default ScriptEditorHeader;