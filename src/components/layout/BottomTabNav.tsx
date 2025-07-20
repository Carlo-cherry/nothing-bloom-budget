import { Home, Receipt, Users, UserCheck, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomTabNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "expenses", label: "Expenses", icon: Receipt },
  { id: "friends", label: "Friends", icon: Users },
  { id: "groups", label: "Groups", icon: UserCheck },
  { id: "settings", label: "Settings", icon: Settings },
];

export function BottomTabNav({ activeTab, onTabChange }: BottomTabNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 surface-elevated border-t border-border">
      <div className="flex justify-around items-center h-16 px-2 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-smooth min-w-0 flex-1",
                isActive 
                  ? "text-primary glow-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon 
                size={20} 
                className={cn(
                  "mb-1 transition-smooth",
                  isActive && "drop-shadow-[0_0_8px_hsl(var(--primary))]"
                )} 
              />
              <span className="text-xs font-medium truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}