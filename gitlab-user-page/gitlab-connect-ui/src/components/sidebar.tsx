"use client";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Users,
  CreditCard,
  BarChart2,
  GitBranch,
  Key,
  Settings,
  User,
  PaintBucket
} from "lucide-react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function NavItem({ icon, label, active = false }: NavItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 rounded-md cursor-pointer text-sm",
        active ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
      )}
    >
      <div className="w-5 h-5 opacity-80">{icon}</div>
      <span>{label}</span>
    </div>
  );
}

export function Sidebar() {
  return (
    <div className="w-60 border-r px-1 py-4 flex flex-col gap-1.5 bg-white border-gray-200">
      <div className="px-4 mb-1 text-xs font-semibold text-gray-500">TEAM</div>
      <NavItem icon={<Users size={16} />} label="Team Members" />
      <NavItem icon={<CreditCard size={16} />} label="Plans & Billing" />
      <NavItem icon={<BarChart2 size={16} />} label="Usage" />
      <NavItem icon={<GitBranch size={16} />} label="Git Connect" active />
      <NavItem icon={<Key size={16} />} label="API Tokens" />
      <NavItem icon={<Settings size={16} />} label="Team Settings" />

      <Separator className="my-3 bg-gray-200" />

      <div className="px-4 mb-1 text-xs font-semibold text-gray-500">PERSONAL</div>
      <NavItem icon={<User size={16} />} label="Profile" />
      <NavItem icon={<PaintBucket size={16} />} label="Appearance" />
    </div>
  );
}
