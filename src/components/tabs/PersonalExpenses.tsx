import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Expense {
  id: string;
  category: string;
  paymentMode: string;
  date: string;
  description: string;
  amount: number;
}

export function PersonalExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      category: "Food",
      paymentMode: "Credit Card",
      date: "2024-01-20",
      description: "Lunch at downtown cafe",
      amount: 15.50
    },
    {
      id: "2", 
      category: "Transport",
      paymentMode: "Debit Card",
      date: "2024-01-19",
      description: "Gas station",
      amount: 45.75
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState({
    category: "",
    paymentMode: "",
    date: "",
    description: "",
    amount: ""
  });

  const categories = ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Healthcare", "Other"];
  const paymentModes = ["Cash", "Credit Card", "Debit Card", "UPI", "Bank Transfer"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newExpense: Expense = {
      id: editingExpense?.id || Date.now().toString(),
      category: formData.category,
      paymentMode: formData.paymentMode,
      date: formData.date,
      description: formData.description,
      amount: parseFloat(formData.amount)
    };

    if (editingExpense) {
      setExpenses(expenses.map(exp => exp.id === editingExpense.id ? newExpense : exp));
    } else {
      setExpenses([newExpense, ...expenses]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ category: "", paymentMode: "", date: "", description: "", amount: "" });
    setShowForm(false);
    setEditingExpense(null);
  };

  const handleEdit = (expense: Expense) => {
    setFormData({
      category: expense.category,
      paymentMode: expense.paymentMode,
      date: expense.date,
      description: expense.description,
      amount: expense.amount.toString()
    });
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Personal Expenses</h1>
          <p className="text-muted-foreground">Track your spending</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="glow-primary"
          size="sm"
        >
          <Plus size={16} className="mr-1" />
          Add
        </Button>
      </div>

      {showForm && (
        <Card className="surface-elevated">
          <CardHeader>
            <CardTitle>{editingExpense ? "Edit Expense" : "Add New Expense"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="paymentMode">Payment Mode</Label>
                  <Select value={formData.paymentMode} onValueChange={(value) => setFormData({...formData, paymentMode: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentModes.map(mode => (
                        <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  placeholder="Enter expense description..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="glow-primary">
                  {editingExpense ? "Update" : "Add Expense"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {expenses.map((expense) => (
          <Card key={expense.id} className="surface-elevated">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{expense.description}</span>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      {expense.category}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {expense.paymentMode} • {new Date(expense.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">${expense.amount.toFixed(2)}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(expense)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(expense.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}