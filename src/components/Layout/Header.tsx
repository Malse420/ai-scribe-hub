import { Bell } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-neutral-200 z-10">
      <div className="flex items-center justify-between h-full px-6">
        <div className="text-lg font-semibold">Developer Tools</div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-neutral-100 rounded-lg">
            <Bell size={20} />
          </button>
          <div className="w-8 h-8 rounded-full bg-primary-500" />
        </div>
      </div>
    </header>
  );
};

export default Header;