import { Link } from "react-router-dom";
import { ArrowRight, Code2, MessageSquare, Settings } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center space-y-6 animate-fade-in">
          <h1 className="text-5xl font-bold text-neutral-900">
            Developer Tools + AI
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Enhance your development workflow with AI-powered tools, real-time code analysis,
            and intelligent suggestions.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/chat"
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
            >
              Get Started
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl shadow-lg hover-scale">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="text-primary-500" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Chat Assistant</h3>
            <p className="text-neutral-600">
              Get instant help with coding questions, debugging, and best practices.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-lg hover-scale">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Code2 className="text-primary-500" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Developer Tools</h3>
            <p className="text-neutral-600">
              Advanced tools for code analysis, debugging, and performance optimization.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-lg hover-scale">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Settings className="text-primary-500" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Customizable</h3>
            <p className="text-neutral-600">
              Personalize your development environment to match your workflow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;