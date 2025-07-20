import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Users } from "lucide-react";

export function Dashboard() {
  // Mock data - in real app this would come from state/API
  const stats = {
    totalExpenses: 2450.75,
    monthlyBudget: 3000,
    friendsOwed: 125.50,
    owedToFriends: 75.25,
  };

  const budgetPercentage = (stats.totalExpenses / stats.monthlyBudget) * 100;

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Track your spending</p>
      </div>

      {/* Budget Overview */}
      <Card className="surface-elevated">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="text-primary" size={20} />
            Monthly Budget
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-primary">
                ${stats.totalExpenses.toFixed(2)}
              </span>
              <span className="text-muted-foreground">
                / ${stats.monthlyBudget.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full glow-primary transition-smooth"
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {budgetPercentage.toFixed(1)}% of budget used
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="surface-elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-green-400" size={16} />
              <span className="text-sm text-muted-foreground">Friends Owe You</span>
            </div>
            <p className="text-xl font-bold text-green-400">
              ${stats.friendsOwed.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="surface-elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="text-red-400" size={16} />
              <span className="text-sm text-muted-foreground">You Owe</span>
            </div>
            <p className="text-xl font-bold text-red-400">
              ${stats.owedToFriends.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="surface-elevated">
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { description: "Lunch at cafe", amount: -15.50, category: "Food" },
              { description: "Movie tickets", amount: -25.00, category: "Entertainment" },
              { description: "Gas station", amount: -45.75, category: "Transport" },
            ].map((transaction, index) => (
              <div key={index} className="flex justify-between items-center p-2 rounded surface-glow">
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">{transaction.category}</p>
                </div>
                <span className="font-bold text-red-400">
                  ${Math.abs(transaction.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}