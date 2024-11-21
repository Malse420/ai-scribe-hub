import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Camera,
  Search,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Database,
  FileEdit,
  Pencil,
  Mail,
  Settings,
  Code2,
  Activity,
  Workflow,
  X
} from "lucide-react";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const commands = [
    { icon: <Camera />, label: "Capture view", to: "/capture" },
    { icon: <Search />, label: "Search the web", to: "/search" },
    { icon: <HelpCircle />, label: "Explain", to: "/explain" },
    { icon: <MessageSquare />, label: "Ask page", to: "/ask" },
    { icon: <Sparkles />, label: "Summarize", to: "/summarize" },
    { icon: <Database />, label: "Extract data", to: "/extract" },
    { icon: <FileEdit />, label: "Repurpose page", to: "/repurpose" },
    { icon: <Pencil />, label: "Rewrite", to: "/rewrite" },
    { icon: <Mail />, label: "Write a reply", to: "/reply" },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-background border-r border-border transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            <span className="text-lg font-semibold">AI Scribe v9.5</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <nav className="p-2 space-y-1">
        {commands.map((command) => (
          <Link
            key={command.label}
            to={command.to}
            className="command-item"
          >
            <span className="command-icon">{command.icon}</span>
            {!isCollapsed && <span>{command.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Type a question... Press / for commands"
            className="w-full bg-accent px-3 py-2 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;