import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, FolderOpen, Users, CreditCard, ChevronRight, Info, Palette, Bell, Shield, HelpCircle } from "lucide-react";
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

  const SettingsCard = ({ 
    title, 
    description,
    icon: Icon, 
    onClick,
    showChevron = true
  }: { 
    title: string;
    description: string;
    icon: any;
    onClick?: () => void;
    showChevron?: boolean;
  }) => (
    <Card 
      className="surface-dark hover:surface-elevated transition-all duration-300 hover:scale-[1.02] cursor-pointer group border-border/30 hover:border-primary/30"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-all duration-300">
              <Icon className="text-primary w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-muted-foreground text-sm mt-1">{description}</p>
            </div>
          </div>
          {showChevron && (
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
        </div>
      </CardContent>
    </Card>
  );

  const ManageItemsDialog = ({ 
    title, 
    items, 
    type, 
    placeholder 
  }: { 
    title: string;
    items: SettingsItem[];
    type: "categories" | "friends" | "paymentModes";
    placeholder: string;
  }) => (
    <Dialog open={dialogOpen === type} onOpenChange={(open) => !open && resetForm()}>
      <DialogContent className="surface-dark max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Manage {title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder={placeholder}
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit(type);
                }
              }}
              className="flex-1"
            />
            <Button 
              onClick={() => handleSubmit(type)}
              className="glow-primary"
              disabled={!formValue.trim()}
            >
              <Plus size={16} />
            </Button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-3 rounded-lg surface-darker hover:surface-elevated transition-all duration-200 group"
              >
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">{item.name}</span>
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
              <div className="text-center py-8 text-muted-foreground">
                No {title.toLowerCase()} added yet
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-muted-foreground text-lg">Manage your app preferences</p>
      </div>

      {/* Management Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground mb-4">Management</h2>
        
        <SettingsCard
          title="Categories"
          description="Manage expense categories"
          icon={FolderOpen}
          onClick={() => setDialogOpen("categories")}
        />

        <SettingsCard
          title="Friends"
          description="Manage your friend list"
          icon={Users}
          onClick={() => setDialogOpen("friends")}
        />

        <SettingsCard
          title="Payment Modes"
          description="Manage payment methods"
          icon={CreditCard}
          onClick={() => setDialogOpen("paymentModes")}
        />
      </div>

      {/* App Preferences */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground mb-4">Preferences</h2>
        
        <SettingsCard
          title="Theme"
          description="Nothing Phone Dark"
          icon={Palette}
          showChevron={false}
        />

        <SettingsCard
          title="Notifications"
          description="Manage notification settings"
          icon={Bell}
        />

        <SettingsCard
          title="Privacy & Security"
          description="Manage your privacy settings"
          icon={Shield}
        />
      </div>

      {/* App Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground mb-4">About</h2>
        
        <Card className="surface-dark border-border/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <Info className="text-primary w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">App Information</h3>
                <p className="text-muted-foreground text-sm">Version and statistics</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg surface-darker">
                <span className="text-muted-foreground">Version</span>
                <span className="font-semibold text-primary">1.0.0</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg surface-darker">
                <span className="text-muted-foreground">Categories</span>
                <span className="font-semibold text-primary">{categories.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg surface-darker">
                <span className="text-muted-foreground">Friends</span>
                <span className="font-semibold text-primary">{friends.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg surface-darker">
                <span className="text-muted-foreground">Payment Methods</span>
                <span className="font-semibold text-primary">{paymentModes.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <SettingsCard
          title="Help & Support"
          description="Get help and contact support"
          icon={HelpCircle}
        />
      </div>

      {/* Management Dialogs */}
      <ManageItemsDialog
        title="Categories"
        items={categories}
        type="categories"
        placeholder="Enter category name (e.g., Food, Travel)"
      />

      <ManageItemsDialog
        title="Friends"
        items={friends}
        type="friends"
        placeholder="Enter friend's name"
      />

      <ManageItemsDialog
        title="Payment Modes"
        items={paymentModes}
        type="paymentModes"
        placeholder="Enter payment method (e.g., PayPal, Venmo)"
      />
    </div>
  );
}