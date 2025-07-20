import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

interface Payment {
  id: string;
  friend: string;
  amount: number;
  description: string;
  date: string;
  settled: boolean;
}

export function FriendPayments() {
  const [myPayments, setMyPayments] = useState<Payment[]>([
    {
      id: "1",
      friend: "Alice",
      amount: 25.00,
      description: "Movie tickets",
      date: "2024-01-20",
      settled: false
    },
    {
      id: "2", 
      friend: "Bob",
      amount: 15.50,
      description: "Lunch split",
      date: "2024-01-19",
      settled: true
    }
  ]);

  const [otherPayments, setOtherPayments] = useState<Payment[]>([
    {
      id: "3",
      friend: "Charlie", 
      amount: 30.75,
      description: "Groceries",
      date: "2024-01-18",
      settled: false
    },
    {
      id: "4",
      friend: "Diana",
      amount: 20.00,
      description: "Dinner split",
      date: "2024-01-17",
      settled: false
    }
  ]);

  const toggleSettled = (id: string, isMyPayment: boolean) => {
    if (isMyPayment) {
      setMyPayments(payments => 
        payments.map(p => p.id === id ? { ...p, settled: !p.settled } : p)
      );
    } else {
      setOtherPayments(payments => 
        payments.map(p => p.id === id ? { ...p, settled: !p.settled } : p)
      );
    }
  };

  const PaymentCard = ({ payment, isMyPayment }: { payment: Payment; isMyPayment: boolean }) => (
    <Card className="surface-elevated">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">{payment.description}</span>
              {payment.settled && (
                <CheckCircle size={16} className="text-green-400" />
              )}
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              {isMyPayment ? `You paid for ${payment.friend}` : `${payment.friend} paid for you`}
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(payment.date).toLocaleDateString()}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className={`font-bold text-lg flex items-center gap-1 ${
                isMyPayment ? 'text-green-400' : 'text-red-400'
              }`}>
                 {isMyPayment ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                ₹{payment.amount.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                {payment.settled ? 'Settled' : 'Pending'}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSettled(payment.id, isMyPayment)}
              className={payment.settled ? 'bg-green-900/20 border-green-400' : ''}
            >
              {payment.settled ? 'Settled' : 'Mark Paid'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const pendingOwed = myPayments.filter(p => !p.settled).reduce((sum, p) => sum + p.amount, 0);
  const pendingToReturn = otherPayments.filter(p => !p.settled).reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Friend Payments</h1>
        <p className="text-muted-foreground">Track shared expenses</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="surface-elevated border-green-400/20">
          <CardContent className="p-4 text-center">
            <div className="text-green-400 font-bold text-xl">
              ₹{pendingOwed.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Friends owe you</div>
          </CardContent>
        </Card>
        
        <Card className="surface-elevated border-red-400/20">
          <CardContent className="p-4 text-center">
            <div className="text-red-400 font-bold text-xl">
              ₹{pendingToReturn.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">You owe friends</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="my-payments" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-payments">My Payments</TabsTrigger>
          <TabsTrigger value="other-payments">Other Payments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-payments" className="space-y-3 mt-4">
          <div className="text-sm text-muted-foreground mb-3">
            Payments you made for others that they need to return
          </div>
          {myPayments.map((payment) => (
            <PaymentCard key={payment.id} payment={payment} isMyPayment={true} />
          ))}
          {myPayments.length === 0 && (
            <Card className="surface-elevated">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No payments made for others yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="other-payments" className="space-y-3 mt-4">
          <div className="text-sm text-muted-foreground mb-3">
            Payments others made for you that you need to return
          </div>
          {otherPayments.map((payment) => (
            <PaymentCard key={payment.id} payment={payment} isMyPayment={false} />
          ))}
          {otherPayments.length === 0 && (
            <Card className="surface-elevated">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No pending payments to return</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}