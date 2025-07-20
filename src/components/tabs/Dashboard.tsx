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
    <div className="space-y-6 pb-20 animate-in fade-in-50 duration-500">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">Track your spending journey</p>
      </div>

      {/* Budget Overview */}
      <Card className="surface-dark border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10 border border-primary/20">
              <DollarSign className="text-primary" size={20} />
            </div>
            Monthly Budget
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold text-primary drop-shadow-sm">
                ₹{stats.totalExpenses.toFixed(2)}
              </span>
              <span className="text-muted-foreground text-lg">
                / ₹{stats.monthlyBudget.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full glow-primary transition-all duration-700 ease-out shadow-sm"
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              {budgetPercentage.toFixed(1)}% of budget used
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="surface-dark border-green-400/20 hover:border-green-400/40 transition-all duration-300 hover:scale-[1.02] group">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-green-400/10 border border-green-400/20 group-hover:bg-green-400/20 transition-colors">
                <TrendingUp className="text-green-400" size={16} />
              </div>
              <span className="text-sm text-muted-foreground font-medium">Friends Owe You</span>
            </div>
            <p className="text-2xl font-bold text-green-400 drop-shadow-sm">
              ₹{stats.friendsOwed.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="surface-dark border-red-400/20 hover:border-red-400/40 transition-all duration-300 hover:scale-[1.02] group">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-red-400/10 border border-red-400/20 group-hover:bg-red-400/20 transition-colors">
                <TrendingDown className="text-red-400" size={16} />
              </div>
              <span className="text-sm text-muted-foreground font-medium">You Owe</span>
            </div>
            <p className="text-2xl font-bold text-red-400 drop-shadow-sm">
              ₹{stats.owedToFriends.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="surface-dark border-primary/10 shadow-lg hover:border-primary/30 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-3">
            <div className="w-2 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full"></div>
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { description: "Lunch at cafe", amount: -15.50, category: "Food" },
              { description: "Movie tickets", amount: -25.00, category: "Entertainment" },
              { description: "Gas station", amount: -45.75, category: "Transport" },
            ].map((transaction, index) => (
              <div key={index} className="flex justify-between items-center p-4 rounded-lg surface-darker border border-border/30 hover:border-primary/30 transition-all duration-200 hover:scale-[1.01] group">
                <div>
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground font-medium">{transaction.category}</p>
                </div>
                <span className="font-bold text-red-400 text-lg drop-shadow-sm">
                  ₹{Math.abs(transaction.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}