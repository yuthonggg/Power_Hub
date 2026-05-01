import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Wallet, TrendingUp, Clock, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const monthlyEarningsData = [
  { month: 'Jan', earnings: 320 },
  { month: 'Feb', earnings: 380 },
  { month: 'Mar', earnings: 450 },
  { month: 'Apr', earnings: 520 },
  { month: 'May', earnings: 580 },
  { month: 'Jun', earnings: 620 },
  { month: 'Jul', earnings: 590 },
  { month: 'Aug', earnings: 650 },
  { month: 'Sep', earnings: 610 },
  { month: 'Oct', earnings: 680 },
  { month: 'Nov', earnings: 720 },
  { month: 'Dec', earnings: 750 },
];

const payoutHistory = [
  {
    date: '2025-04-15',
    amount: 500,
    bank: 'Maybank',
    status: 'Completed',
  },
  {
    date: '2025-03-20',
    amount: 450,
    bank: 'CIMB',
    status: 'Completed',
  },
  {
    date: '2025-02-18',
    amount: 380,
    bank: 'Maybank',
    status: 'Completed',
  },
  {
    date: '2025-01-25',
    amount: 420,
    bank: 'Public Bank',
    status: 'Completed',
  },
];

export default function ProsumerEarnings() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const navItems = [
    { label: 'Overview', href: '/prosumer' },
    { label: 'Energy Exports', href: '/prosumer/exports' },
    { label: 'Earnings & Payouts', href: '/prosumer/earnings' },
    { label: 'Solar Profile', href: '/prosumer/profile' },
    { label: 'Settings', href: '/prosumer/settings' },
  ];

  const thisMonthEarnings = 580;
  const lifetimeEarnings = 6250;
  const pendingPayout = 580;
  const walletBalance = 1250.75;
  const totalExported = 18450;

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Earnings & Payouts</h1>
          <p className="text-muted-foreground">
            Track your solar energy earnings and manage payouts
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={TrendingUp}
            label="This Month Earnings"
            value={`RM ${thisMonthEarnings.toFixed(2)}`}
            color="green"
          />
          <StatCard
            icon={Wallet}
            label="Total Lifetime Earnings"
            value={`RM ${lifetimeEarnings.toFixed(2)}`}
            color="amber"
          />
          <StatCard
            icon={Clock}
            label="Pending Payout"
            value={`RM ${pendingPayout.toFixed(2)}`}
            color="blue"
          />
          <StatCard
            label="Total kWh Exported"
            value={totalExported}
            unit="kWh"
            color="green"
          />
        </div>

        {/* Monthly Earnings Chart */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Earnings - Last 12 Months</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyEarningsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="earnings" fill="#1D9E75" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payout Section */}
        <div className="card-soft p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">Request Payout</h2>
              <p className="text-sm text-muted-foreground">
                Withdraw your earnings to your bank account
              </p>
            </div>
            <Dialog open={payoutDialogOpen} onOpenChange={setPayoutDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  Request Payout
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Payout</DialogTitle>
                  <DialogDescription>
                    Enter your bank details to withdraw earnings
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Current Wallet Balance</Label>
                    <p className="text-2xl font-bold text-power-green mt-2">
                      RM {walletBalance.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="amount">Payout Amount (RM)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Minimum RM 10.00"
                      min="10"
                      max={walletBalance}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bank">Bank Name</Label>
                    <Input id="bank" placeholder="e.g., Maybank, CIMB, Public Bank" />
                  </div>
                  <div>
                    <Label htmlFor="account">Account Number</Label>
                    <Input id="account" placeholder="Your bank account number" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Processing time: 3–5 business days
                  </p>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Confirm Payout
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Current Wallet Balance</p>
              <p className="text-3xl font-bold text-power-green">
                RM {walletBalance.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Available for withdrawal
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Pending Payout</p>
              <p className="text-3xl font-bold text-power-amber">
                RM {pendingPayout.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Will be added next billing cycle
              </p>
            </div>
          </div>
        </div>

        {/* Payout History */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Payout History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-right py-3 px-4 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold">Bank</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {payoutHistory.map((payout, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-secondary/50">
                    <td className="py-3 px-4">{payout.date}</td>
                    <td className="text-right py-3 px-4 font-semibold">
                      RM {payout.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">{payout.bank}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        ✓ {payout.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
