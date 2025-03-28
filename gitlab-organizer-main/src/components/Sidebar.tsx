
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  GitBranch, 
  Settings, 
  Users, 
  CreditCard, 
  BarChart3,
  Key,
  User,
  Paintbrush,
} from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, isActive }) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-2 py-2 px-4 rounded-md text-sm",
        "transition-colors duration-200",
        isActive 
          ? "bg-blue-600 text-white" 
          : "text-gray-700 hover:bg-gray-100"
      )}
    >
      <span className="w-5 h-5">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const teamMenuItems = [
    { to: "/team-members", icon: <Users size={18} />, label: "Team Members" },
    { to: "/billing", icon: <CreditCard size={18} />, label: "Plans & Billing" },
    { to: "/usage", icon: <BarChart3 size={18} />, label: "Usage" },
    { to: "/git-connect", icon: <GitBranch size={18} />, label: "Git Connect" },
    { to: "/api-tokens", icon: <Key size={18} />, label: "API Tokens" },
    { to: "/team-settings", icon: <Settings size={18} />, label: "Team Settings" },
  ];

  const personalMenuItems = [
    { to: "/profile", icon: <User size={18} />, label: "Profile" },
    { to: "/appearance", icon: <Paintbrush size={18} />, label: "Appearance" },
  ];

  return (
    <div className="w-64 h-screen border-r bg-white flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">GitLab Organizer</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="pt-4 pb-2 px-4">
          <h2 className="text-xs uppercase font-semibold text-gray-500 tracking-wider">Team</h2>
        </div>
        <nav className="px-2 space-y-1">
          {teamMenuItems.map((item) => (
            <SidebarItem 
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.to}
            />
          ))}
        </nav>
        
        <div className="pt-6 pb-2 px-4">
          <h2 className="text-xs uppercase font-semibold text-gray-500 tracking-wider">Personal</h2>
        </div>
        <nav className="px-2 space-y-1">
          {personalMenuItems.map((item) => (
            <SidebarItem 
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.to}
            />
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
