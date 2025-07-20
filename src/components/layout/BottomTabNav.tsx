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
    <div className="fixed bottom-0 left-0 right-0 surface-dark border-t border-border/30 backdrop-blur-lg bg-background/90 shadow-2xl">
      <div className="flex justify-around items-center h-16 px-2 max-w-md mx-auto relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-primary/30 rounded-full"></div>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 min-w-0 flex-1 hover:scale-110 active:scale-95",
                isActive 
                  ? "text-primary glow-primary bg-primary/10 border border-primary/20" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon 
                size={22} 
                className={cn(
                  "mb-1 transition-all duration-300",
                  isActive && "drop-shadow-[0_0_12px_hsl(var(--primary))]"
                )} 
              />
              <span className={cn(
                "text-xs font-medium truncate transition-all duration-300",
                isActive && "font-semibold"
              )}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}