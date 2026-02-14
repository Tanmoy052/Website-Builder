"use client";

import React from "react";
import {
  Plus,
  MessageSquare,
  Layout,
  Settings,
  FolderOpen,
  History,
  Cloud,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  return (
    <aside className="studio-sidebar flex flex-col h-full border-r border-studio-border bg-white">
      <div className="p-4 border-b border-studio-border">
        <button className="flex items-center justify-center gap-2 w-full py-2 bg-studio-accent text-white rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm">
          <Plus size={18} />
          <span>New Project</span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Navigation
        </div>
        <SidebarItem
          icon={<MessageSquare size={18} />}
          label="AI Chat"
          active
        />
        <SidebarItem icon={<Layout size={18} />} label="Website Builder" />
        <SidebarItem icon={<FolderOpen size={18} />} label="My Projects" />

        <div className="mt-4 px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Resources
        </div>
        <SidebarItem icon={<History size={18} />} label="Prompt Library" />
        <SidebarItem icon={<Cloud size={18} />} label="Deployment" />
      </nav>

      <div className="p-4 border-t border-studio-border">
        <SidebarItem icon={<Settings size={18} />} label="Settings" />
      </div>
    </aside>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active }) => {
  return (
    <button
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-md transition-colors text-sm font-medium ${
        active
          ? "bg-blue-50 text-studio-accent"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};
