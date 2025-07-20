import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Users, DollarSign, CalendarIcon, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface GroupPayment {
  id: string;
  description: string;
  totalAmount: number;
  paidBy: string;
  splitType: "equal" | "custom";
  participants: { name: string; amount: number; includeSelf: boolean; settled: boolean }[];
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
        { name: "Alice", amount: 30.00, includeSelf: false, settled: false },
        { name: "Bob", amount: 30.00, includeSelf: false, settled: true },
        { name: "Charlie", amount: 30.00, includeSelf: false, settled: false },
        { name: "You", amount: 30.00, includeSelf: true, settled: true }
      ],
      date: "2024-01-20"
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<GroupPayment | null>(null);
  const [formData, setFormData] = useState({
    description: "",
    totalAmount: "",
    paidBy: "You",
    splitType: "equal" as "equal" | "custom",
    includeSelf: true,
    selectedFriends: [] as string[],
    date: undefined as Date | undefined
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
          includeSelf: false,
          settled: false
        })),
        ...(formData.includeSelf ? [{ name: "You", amount: amountPerPerson, includeSelf: true, settled: true }] : [])
      ];
    } else {
      // For custom split, we'll implement this later
      participants = formData.selectedFriends.map(friend => ({
        name: friend,
        amount: 0,
        includeSelf: false,
        settled: false
      }));
    }

    const newPayment: GroupPayment = {
      id: editingPayment?.id || Date.now().toString(),
      description: formData.description,
      totalAmount,
      paidBy: formData.paidBy,
      splitType: formData.splitType,
      participants,
      date: formData.date ? formData.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    };

    if (editingPayment) {
      setPayments(payments.map(p => p.id === editingPayment.id ? newPayment : p));
    } else {
      setPayments([newPayment, ...payments]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      description: "",
      totalAmount: "",
      paidBy: "You",
      splitType: "equal",
      includeSelf: true,
      selectedFriends: [],
      date: undefined
    });
    setShowForm(false);
    setEditingPayment(null);
  };

  const toggleFriend = (friend: string) => {
    setFormData(prev => ({
      ...prev,
      selectedFriends: prev.selectedFriends.includes(friend)
        ? prev.selectedFriends.filter(f => f !== friend)
        : [...prev.selectedFriends, friend]
    }));
  };

  const handleEdit = (payment: GroupPayment) => {
    setFormData({
      description: payment.description,
      totalAmount: payment.totalAmount.toString(),
      paidBy: payment.paidBy,
      splitType: payment.splitType,
      includeSelf: payment.participants.some(p => p.includeSelf),
      selectedFriends: payment.participants.filter(p => !p.includeSelf).map(p => p.name),
      date: payment.date ? new Date(payment.date) : undefined
    });
    setEditingPayment(payment);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setPayments(payments.filter(p => p.id !== id));
  };

  const toggleSettle = (paymentId: string, participantIndex: number) => {
    setPayments(payments.map(payment => 
      payment.id === paymentId 
        ? {
            ...payment,
            participants: payment.participants.map((participant, index) =>
              index === participantIndex 
                ? { ...participant, settled: !participant.settled }
                : participant
            )
          }
        : payment
    ));
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Group Payments
          </h1>
          <p className="text-muted-foreground text-lg">Split expenses with multiple people</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="glow-primary hover:scale-105 transition-all duration-200 shadow-lg"
          size="sm"
        >
          <Plus size={16} className="mr-1" />
          Add
        </Button>
      </div>

      {showForm && (
        <Card className="surface-elevated border-primary/20 shadow-xl animate-in slide-in-from-top-4 duration-300">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3">
              <div className="w-2 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full"></div>
              {editingPayment ? "Edit Group Payment" : "Create Group Payment"}
            </CardTitle>
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
                <div className="p-4 rounded-lg surface-glow border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-2 font-medium">Split Preview:</p>
                  <p className="text-lg font-semibold text-primary">
                    Each person pays: ₹{(
                      parseFloat(formData.totalAmount || "0") / 
                      (formData.selectedFriends.length + (formData.includeSelf ? 1 : 0))
                    ).toFixed(2)}
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon size={16} className="mr-2" />
                      {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => setFormData({...formData, date})}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="glow-primary hover:scale-105 transition-all duration-200" disabled={formData.selectedFriends.length === 0}>
                  {editingPayment ? "Update Group Payment" : "Create Group Payment"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="hover:scale-105 transition-all duration-200">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {payments.map((payment) => (
          <Card key={payment.id} className="surface-elevated border-border/50 hover:border-primary/30 transition-all duration-200 hover:scale-[1.01] group shadow-md hover:shadow-lg">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">{payment.description}</div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Paid by {payment.paidBy} • {new Date(payment.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="font-bold text-xl text-primary drop-shadow-sm">₹{payment.totalAmount.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground font-medium">
                      {payment.splitType === "equal" ? "Equal Split" : "Custom Split"}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(payment)}
                      className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(payment.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {payment.participants.map((participant, index) => (
                  <div key={index} className="flex justify-between items-center p-3 rounded-lg surface-glow border border-border/30 hover:border-primary/30 transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <Users size={14} className="text-muted-foreground" />
                      <span className="text-sm font-medium">{participant.name}</span>
                      {participant.settled && (
                        <span className="text-xs bg-green-900/20 text-green-400 px-2 py-1 rounded-full font-medium border border-green-400/30">Settled</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-primary">₹{participant.amount.toFixed(2)}</span>
                      {!participant.includeSelf && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleSettle(payment.id, index)}
                          className={`h-6 text-xs transition-all duration-200 hover:scale-105 ${
                            participant.settled ? 'bg-green-900/20 border-green-400 text-green-400' : 'hover:bg-primary/10 hover:border-primary'
                          }`}
                        >
                          {participant.settled ? 'Settled' : 'Settle'}
                        </Button>
                      )}
                    </div>
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