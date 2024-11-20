import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface CollaboratorInputProps {
  email: string;
  onChange: (email: string) => void;
  onAdd: () => void;
}

export const CollaboratorInput = ({
  email,
  onChange,
  onAdd,
}: CollaboratorInputProps) => {
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Collaborator email"
        value={email}
        onChange={(e) => onChange(e.target.value)}
      />
      <Button onClick={onAdd} size="sm">
        <UserPlus className="w-4 h-4 mr-2" />
        Add
      </Button>
    </div>
  );
};