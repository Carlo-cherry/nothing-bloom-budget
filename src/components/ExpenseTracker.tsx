import { useState } from "react";
import { BottomTabNav } from "./layout/BottomTabNav";
import { Dashboard } from "./tabs/Dashboard";
import { PersonalExpenses } from "./tabs/PersonalExpenses";
import { FriendPayments } from "./tabs/FriendPayments";
import { GroupPayments } from "./tabs/GroupPayments";
import { Settings } from "./tabs/Settings";

export function ExpenseTracker() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "expenses":
        return <PersonalExpenses />;
      case "friends":
        return <FriendPayments />;
      case "groups":
        return <GroupPayments />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 pt-6">
        {renderActiveTab()}
      </div>

      {/* Bottom Navigation */}
      <BottomTabNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}