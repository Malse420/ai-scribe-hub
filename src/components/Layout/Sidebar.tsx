import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  MessageSquare, 
  Code2, 
  Settings, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white border-r border-neutral-200 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        {!isCollapsed && <span className="text-lg font-semibold">DevAI</span>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-neutral-100 rounded-lg"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="p-2 space-y-2">
        <Link
          to="/chat"
          className="flex items-center gap-3 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <MessageSquare size={20} />
          {!isCollapsed && <span>Chat</span>}
        </Link>
        <Link
          to="/devtools"
          className="flex items-center gap-3 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <Code2 size={20} />
          {!isCollapsed && <span>Dev Tools</span>}
        </Link>
        <Link
          to="/settings"
          className="flex items-center gap-3 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <Settings size={20} />
          {!isCollapsed && <span>Settings</span>}
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;