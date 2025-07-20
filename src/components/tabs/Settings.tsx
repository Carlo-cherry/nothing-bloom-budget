import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, FolderOpen, Users, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsItem {
  id: string;
  name: string;
}

export function Settings() {
  const { toast } = useToast();
  
  const [categories, setCategories] = useState<SettingsItem[]>([
    { id: "1", name: "Food" },
    { id: "2", name: "Transport" },
    { id: "3", name: "Entertainment" },
    { id: "4", name: "Shopping" },
    { id: "5", name: "Bills" },
    { id: "6", name: "Healthcare" }
  ]);

  const [friends, setFriends] = useState<SettingsItem[]>([
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" },
    { id: "3", name: "Charlie" },
    { id: "4", name: "Diana" },
    { id: "5", name: "Eve" }
  ]);

  const [paymentModes, setPaymentModes] = useState<SettingsItem[]>([
    { id: "1", name: "Cash" },
    { id: "2", name: "Credit Card" },
    { id: "3", name: "Debit Card" },
    { id: "4", name: "UPI" },
    { id: "5", name: "Bank Transfer" }
  ]);

  const [dialogOpen, setDialogOpen] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<SettingsItem | null>(null);
  const [formValue, setFormValue] = useState("");

  const handleSubmit = (type: "categories" | "friends" | "paymentModes") => {
    if (!formValue.trim()) return;

    const newItem: SettingsItem = {
      id: editingItem?.id || Date.now().toString(),
      name: formValue.trim()
    };

    if (editingItem) {
      // Edit existing item
      switch (type) {
        case "categories":
          setCategories(cats => cats.map(cat => cat.id === editingItem.id ? newItem : cat));
          break;
        case "friends":
          setFriends(friends => friends.map(friend => friend.id === editingItem.id ? newItem : friend));
          break;
        case "paymentModes":
          setPaymentModes(modes => modes.map(mode => mode.id === editingItem.id ? newItem : mode));
          break;
      }
      toast({
        title: "Updated successfully",
        description: `${formValue} has been updated.`
      });
    } else {
      // Add new item
      switch (type) {
        case "categories":
          setCategories(cats => [...cats, newItem]);
          break;
        case "friends":
          setFriends(friends => [...friends, newItem]);
          break;
        case "paymentModes":
          setPaymentModes(modes => [...modes, newItem]);
          break;
      }
      toast({
        title: "Added successfully",
        description: `${formValue} has been added.`
      });
    }

    resetForm();
  };

  const handleEdit = (item: SettingsItem, type: string) => {
    setEditingItem(item);
    setFormValue(item.name);
    setDialogOpen(type);
  };

  const handleDelete = (id: string, type: "categories" | "friends" | "paymentModes", name: string) => {
    switch (type) {
      case "categories":
        setCategories(cats => cats.filter(cat => cat.id !== id));
        break;
      case "friends":
        setFriends(friends => friends.filter(friend => friend.id !== id));
        break;
      case "paymentModes":
        setPaymentModes(modes => modes.filter(mode => mode.id !== id));
        break;
    }
    toast({
      title: "Deleted successfully",
      description: `${name} has been removed.`
    });
  };

  const resetForm = () => {
    setFormValue("");
    setEditingItem(null);
    setDialogOpen(null);
  };

  const SettingsSection = ({ 
    title, 
    icon: Icon, 
    items, 
    type, 
    placeholder 
  }: { 
    title: string;
    icon: any;
    items: SettingsItem[];
    type: "categories" | "friends" | "paymentModes";
    placeholder: string;
  }) => (
    <Card className="surface-elevated border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-full bg-primary/10 border border-primary/20">
            <Icon className="text-primary" size={20} />
          </div>
          Manage {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Dialog open={dialogOpen === type} onOpenChange={(open) => !open && resetForm()}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => setDialogOpen(type)}
              className="w-full glow-primary hover:scale-105 transition-all duration-200 shadow-lg"
              variant="outline"
            >
              <Plus size={16} className="mr-2" />
              Add {title.slice(0, -1)}
            </Button>
          </DialogTrigger>
          <DialogContent className="surface-elevated">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? `Edit ${title.slice(0, -1)}` : `Add New ${title.slice(0, -1)}`}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder={placeholder}
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSubmit(type);
                    }
                  }}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSubmit(type)}
                  className="glow-primary"
                  disabled={!formValue.trim()}
                >
                  {editingItem ? "Update" : "Add"}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="space-y-2">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between p-4 rounded-lg surface-glow border border-border/50 hover:border-primary/30 transition-all duration-200 hover:scale-[1.01] group"
            >
              <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.name}</span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(item, type)}
                  className="h-8 w-8 p-0 hover:bg-primary/20 hover:text-primary transition-all duration-200"
                >
                  <Edit size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(item.id, type, item.name)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/20 transition-all duration-200"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No {title.toLowerCase()} added yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-muted-foreground text-lg">Manage your app preferences</p>
      </div>

      <SettingsSection
        title="Categories"
        icon={FolderOpen}
        items={categories}
        type="categories"
        placeholder="Enter category name (e.g., Food, Travel)"
      />

      <SettingsSection
        title="Friends"
        icon={Users}
        items={friends}
        type="friends"
        placeholder="Enter friend's name"
      />

      <SettingsSection
        title="Payment Modes"
        icon={CreditCard}
        items={paymentModes}
        type="paymentModes"
        placeholder="Enter payment method (e.g., PayPal, Venmo)"
      />

      {/* App Info */}
      <Card className="surface-elevated border-primary/10 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-3">
            <div className="w-2 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full"></div>
            App Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-3 rounded-lg surface-glow">
            <span className="text-muted-foreground">Version</span>
            <span className="font-semibold">1.0.0</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg surface-glow">
            <span className="text-muted-foreground">Theme</span>
            <span className="font-semibold">Nothing Phone Dark</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg surface-glow">
            <span className="text-muted-foreground">Categories</span>
            <span className="font-semibold text-primary">{categories.length}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg surface-glow">
            <span className="text-muted-foreground">Friends</span>
            <span className="font-semibold text-primary">{friends.length}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg surface-glow">
            <span className="text-muted-foreground">Payment Methods</span>
            <span className="font-semibold text-primary">{paymentModes.length}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}