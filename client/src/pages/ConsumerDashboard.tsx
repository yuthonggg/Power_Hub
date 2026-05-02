import { useAuth } from '@/contexts/AuthContext';
import { useEnergy } from '@/contexts/EnergyContext';
import DashboardLayout from '@/components/DashboardLayout';
import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import { Zap, TrendingDown, Leaf, Activity, Wallet, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const usageData = [
  { day: '1', kwh: 28 },
  { day: '2', kwh: 32 },
  { day: '3', kwh: 25 },
  { day: '4', kwh: 30 },
  { day: '5', kwh: 35 },
  { day: '6', kwh: 28 },
  { day: '7', kwh: 33 },
  { day: '8', kwh: 29 },
  { day: '9', kwh: 31 },
  { day: '10', kwh: 27 },
];

export default function ConsumerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const { currentConsumption, startSimulation, lastUpdateTime } = useEnergy();
  const [, setLocation] = useLocation();
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'consumer') {
      setLocation('/login');
    } else {
      startSimulation();
    }
  }, [isAuthenticated, user, setLocation, startSimulation]);

  if (!isAuthenticated || !user || user.role !== 'consumer') {
    return null;
  }

  const navItems = [
    { label: 'Overview', href: '/consumer' },
    { label: 'Plans', href: '/consumer/plans' },
    { label: 'Billing', href: '/consumer/usage' },
    { label: 'Profile', href: '/consumer/profile' },
  ];

  // Subscription plan mapping
  const planKwh = user.activeSubscriptionPlan === 'Pro' ? 500
    : user.activeSubscriptionPlan === 'Plus' ? 300
    : 100; // Standard

  const monthlyRate = 44; // sen/kWh
  const totalUsage = 850; // example total monthly usage
  const solarAllocation = Math.min(totalUsage, planKwh);
  const tnbUsage = totalUsage - solarAllocation;

  const solarCost = solarAllocation * monthlyRate / 100;
  const tnbRate = user.accountType === 'shoplet' || user.accountType === 'cafe' || user.accountType === 'laundromat' || user.accountType === 'office' || user.accountType === 'clinic'
    ? 50.68
    : 54.43; // high-usage domestic
  const tnbCost = tnbUsage * tnbRate / 100;
  const totalCost = solarCost + tnbCost;

  // What it would cost fully on TNB
  const fullTnbCost = totalUsage * tnbRate / 100;
  const savings = (fullTnbCost - totalCost).toFixed(2);

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Energy Dashboard</h1>
          <p className="text-muted-foreground">Manage your solar subscription and usage</p>
        </div>

        {/* Live Status */}
        <div className="flex items-center gap-2 p-3 bg-power-blue/10 rounded-lg border border-power-blue/20">
          <Activity className="w-4 h-4 text-power-blue animate-pulse" />
          <span className="text-sm text-power-blue font-medium">Live • Updated {lastUpdateTime}</span>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4">
          {/* Current Usage */}
          <div className="card-soft p-6 border-l-4 border-power-blue">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Usage</p>
                <p className="text-3xl font-bold text-power-blue">{currentConsumption} kW</p>
                <p className="text-xs text-muted-foreground mt-1">Real-time</p>
              </div>
              <Zap className="w-8 h-8 text-power-blue/50" />
            </div>
          </div>

          {/* Current Bill */}
          <div className="card-soft p-6 border-l-4 border-power-green">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Bill</p>
                <p className="text-3xl font-bold text-power-green">RM {totalCost.toFixed(2)}</p>
              </div>
              <Leaf className="w-8 h-8 text-power-green/50" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Total estimated for this month</p>
          </div>

          {/* Subscription */}
          <div className="card-soft p-6 border-l-4 border-power-amber">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Plan</p>
                <p className="text-3xl font-bold text-power-amber">{user.activeSubscriptionPlan || 'Plus'}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-power-amber/50" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{planKwh} kWh/month at 44 sen</p>
          </div>

          {/* Wallet Balance */}
          <div className="card-soft p-6 border-l-4 border-emerald-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Wallet Balance</p>
                <p className="text-3xl font-bold text-emerald-600">RM {user.eWalletBalance.toFixed(2)}</p>
              </div>
              <Wallet className="w-8 h-8 text-emerald-500/50" />
            </div>
            <div className="flex gap-2 mt-3">
              <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <ArrowDownLeft className="w-3 h-3" /> Deposit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Deposit to Wallet</DialogTitle>
                    <DialogDescription>Add funds to your Power Hub wallet</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Current Balance</Label>
                      <p className="text-2xl font-bold text-power-green mt-1">RM {user.eWalletBalance.toFixed(2)}</p>
                    </div>
                    <div>
                      <Label htmlFor="deposit-amt">Deposit Amount (RM)</Label>
                      <Input id="deposit-amt" type="number" placeholder="Minimum RM 10.00" min="10" className="mt-1" />
                    </div>
                    <div>
                      <Label>Payment Method</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Button variant="outline" size="sm">FPX</Button>
                        <Button variant="outline" size="sm">Credit Card</Button>
                      </div>
                    </div>
                    <Button className="w-full bg-power-green hover:bg-power-green/90">Confirm Deposit</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <ArrowUpRight className="w-3 h-3" /> Withdraw
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Withdraw from Wallet</DialogTitle>
                    <DialogDescription>Transfer funds to your bank account</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Available Balance</Label>
                      <p className="text-2xl font-bold text-power-green mt-1">RM {user.eWalletBalance.toFixed(2)}</p>
                    </div>
                    <div>
                      <Label htmlFor="withdraw-amt">Withdraw Amount (RM)</Label>
                      <Input id="withdraw-amt" type="number" placeholder="Minimum RM 10.00" min="10" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="bank-name">Bank Name</Label>
                      <Input id="bank-name" placeholder="e.g., Maybank, CIMB" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="acc-no">Account Number</Label>
                      <Input id="acc-no" placeholder="Your bank account number" className="mt-1" />
                    </div>
                    <Button className="w-full bg-power-green hover:bg-power-green/90">Confirm Withdrawal</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Monthly Bill Preview — Split Bill */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Bill Preview — Split Billing</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-power-green/10 rounded-lg border border-power-green/20">
              <p className="text-xs text-muted-foreground mb-1">Power Hub Portion</p>
              <p className="text-2xl font-bold text-power-green">RM {solarCost.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">{solarAllocation} kWh × 44 sen</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
              <p className="text-xs text-muted-foreground mb-1">TNB Portion</p>
              <p className="text-2xl font-bold text-gray-700">RM {tnbCost.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">{tnbUsage} kWh × {tnbRate.toFixed(2)} sen</p>
            </div>
            <div className="p-4 bg-power-blue/10 rounded-lg border border-power-blue/20">
              <p className="text-xs text-muted-foreground mb-1">Total Bill</p>
              <p className="text-2xl font-bold text-power-blue">RM {totalCost.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">{totalUsage} kWh total usage</p>
            </div>
          </div>

          {/* Bill Breakdown */}
          <div className="space-y-2 text-sm border-t border-border pt-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Electricity Used</span>
              <span className="font-medium">{totalUsage} kWh</span>
            </div>
            <div className="flex justify-between text-power-green">
              <span>Solar Allocation (Power Hub)</span>
              <span className="font-medium">−{solarAllocation} kWh</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="text-muted-foreground">Remaining Grid Usage (TNB)</span>
              <span className="font-medium">{tnbUsage} kWh</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border font-semibold text-power-blue">
              <span>Total Estimated Bill</span>
              <span>RM {totalCost.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-muted-foreground">
              💡 Your bill is automatically split between Power Hub and TNB. The Power Hub portion is deducted from your e-wallet. The TNB portion is paid through integrated TNB payment.
            </p>
          </div>
        </div>

        {/* Usage History Chart */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Daily Usage — Last 10 Days</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="kwh"
                stroke="#378ADD"
                strokeWidth={2}
                dot={{ fill: '#378ADD', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subscription Status */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Active Subscription</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Plan</p>
                <p className="text-xl font-semibold">{user.activeSubscriptionPlan || 'Plus'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Monthly Solar Allocation</p>
                <p className="text-xl font-semibold text-power-green">{planKwh} kWh</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Rate</p>
                <p className="text-xl font-semibold">{monthlyRate} sen/kWh</p>
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Status</p>
                <Badge className="bg-power-green text-white">Active</Badge>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setLocation('/consumer/plans')}>
                Change Plan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
