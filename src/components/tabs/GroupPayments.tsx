import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Users, DollarSign } from "lucide-react";

interface GroupPayment {
  id: string;
  description: string;
  totalAmount: number;
  paidBy: string;
  splitType: "equal" | "custom";
  participants: { name: string; amount: number; includeSelf: boolean }[];
  date: string;
}

export function GroupPayments() {
  const [payments, setPayments] = useState<GroupPayment[]>([
    {
      id: "1",
      description: "Team dinner",
      totalAmount: 120.00,
      paidBy: "You",
      splitType: "equal",
      participants: [
        { name: "Alice", amount: 30.00, includeSelf: false },
        { name: "Bob", amount: 30.00, includeSelf: false },
        { name: "Charlie", amount: 30.00, includeSelf: false },
        { name: "You", amount: 30.00, includeSelf: true }
      ],
      date: "2024-01-20"
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    totalAmount: "",
    paidBy: "You",
    splitType: "equal" as "equal" | "custom",
    includeSelf: true,
    selectedFriends: [] as string[]
  });

  const availableFriends = ["Alice", "Bob", "Charlie", "Diana", "Eve"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalAmount = parseFloat(formData.totalAmount);
    let participants;
    
    if (formData.splitType === "equal") {
      const participantCount = formData.selectedFriends.length + (formData.includeSelf ? 1 : 0);
      const amountPerPerson = totalAmount / participantCount;
      
      participants = [
        ...formData.selectedFriends.map(friend => ({
          name: friend,
          amount: amountPerPerson,
          includeSelf: false
        })),
        ...(formData.includeSelf ? [{ name: "You", amount: amountPerPerson, includeSelf: true }] : [])
      ];
    } else {
      // For custom split, we'll implement this later
      participants = formData.selectedFriends.map(friend => ({
        name: friend,
        amount: 0,
        includeSelf: false
      }));
    }

    const newPayment: GroupPayment = {
      id: Date.now().toString(),
      description: formData.description,
      totalAmount,
      paidBy: formData.paidBy,
      splitType: formData.splitType,
      participants,
      date: new Date().toISOString().split('T')[0]
    };

    setPayments([newPayment, ...payments]);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      description: "",
      totalAmount: "",
      paidBy: "You",
      splitType: "equal",
      includeSelf: true,
      selectedFriends: []
    });
    setShowForm(false);
  };

  const toggleFriend = (friend: string) => {
    setFormData(prev => ({
      ...prev,
      selectedFriends: prev.selectedFriends.includes(friend)
        ? prev.selectedFriends.filter(f => f !== friend)
        : [...prev.selectedFriends, friend]
    }));
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Group Payments</h1>
          <p className="text-muted-foreground">Split expenses with multiple people</p>
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
            <CardTitle>Create Group Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  placeholder="What was this expense for?"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalAmount">Total Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="paidBy">Paid By</Label>
                  <Select value={formData.paidBy} onValueChange={(value) => setFormData({...formData, paidBy: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="You">You</SelectItem>
                      {availableFriends.map(friend => (
                        <SelectItem key={friend} value={friend}>{friend}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Split Type</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="equal"
                      checked={formData.splitType === "equal"}
                      onChange={(e) => setFormData({...formData, splitType: e.target.value as "equal"})}
                    />
                    <span>Equal Split</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="custom"
                      checked={formData.splitType === "custom"}
                      onChange={(e) => setFormData({...formData, splitType: e.target.value as "custom"})}
                    />
                    <span>Custom Split</span>
                  </label>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Checkbox
                    id="includeSelf"
                    checked={formData.includeSelf}
                    onCheckedChange={(checked) => setFormData({...formData, includeSelf: !!checked})}
                  />
                  <Label htmlFor="includeSelf">Include yourself in the split</Label>
                </div>
              </div>

              <div>
                <Label>Select Participants</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableFriends.map(friend => (
                    <label key={friend} className="flex items-center gap-2 p-2 rounded surface-glow">
                      <Checkbox
                        checked={formData.selectedFriends.includes(friend)}
                        onCheckedChange={() => toggleFriend(friend)}
                      />
                      <span>{friend}</span>
                    </label>
                  ))}
                </div>
              </div>

              {formData.splitType === "equal" && formData.totalAmount && (
                <div className="p-3 rounded surface-glow">
                  <p className="text-sm text-muted-foreground mb-2">Split Preview:</p>
                  <p className="text-sm">
                    Each person pays: ${(
                      parseFloat(formData.totalAmount || "0") / 
                      (formData.selectedFriends.length + (formData.includeSelf ? 1 : 0))
                    ).toFixed(2)}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" className="glow-primary" disabled={formData.selectedFriends.length === 0}>
                  Create Group Payment
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
        {payments.map((payment) => (
          <Card key={payment.id} className="surface-elevated">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-medium mb-1">{payment.description}</div>
                  <div className="text-sm text-muted-foreground">
                    Paid by {payment.paidBy} • {new Date(payment.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">${payment.totalAmount.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">
                    {payment.splitType === "equal" ? "Equal Split" : "Custom Split"}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                {payment.participants.map((participant, index) => (
                  <div key={index} className="flex justify-between items-center p-2 rounded surface-glow">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-muted-foreground" />
                      <span className="text-sm">{participant.name}</span>
                    </div>
                    <span className="text-sm font-medium">${participant.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}