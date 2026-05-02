import { useAuth } from '@/contexts/AuthContext';
import { useEnergy } from '@/contexts/EnergyContext';
import DashboardLayout from '@/components/DashboardLayout';
import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import { TrendingDown, Leaf, Activity, Wallet, ArrowDownLeft, ArrowUpRight, CreditCard, CheckCircle, Clock } from 'lucide-react';
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

const paymentHistory = [
  { date: '2025-04-30', amount: 425.80, method: 'Wallet', status: 'Paid', ref: 'PWH-20250430-001' },
  { date: '2025-03-31', amount: 410.50, method: 'FPX (Maybank)', status: 'Paid', ref: 'PWH-20250331-001' },
  { date: '2025-02-28', amount: 398.20, method: 'Credit Card', status: 'Paid', ref: 'PWH-20250228-001' },
  { date: '2025-01-31', amount: 435.10, method: 'TNG eWallet', status: 'Paid', ref: 'PWH-20250131-001' },
];

export default function ConsumerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const { startSimulation, lastUpdateTime } = useEnergy();
  const [, setLocation] = useLocation();
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [selectedPayMethod, setSelectedPayMethod] = useState<string | null>(null);

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

  const paymentMethods = [
    { id: 'wallet', label: 'Power Hub Wallet', desc: `Balance: RM ${user.eWalletBalance.toFixed(2)}`, icon: '💳' },
    { id: 'fpx', label: 'FPX Online Banking', desc: 'Maybank, CIMB, RHB, etc.', icon: '🏦' },
    { id: 'tng', label: 'Touch \'n Go eWallet', desc: 'Pay via TNG app', icon: '📱' },
    { id: 'credit', label: 'Credit / Debit Card', desc: 'Visa, Mastercard', icon: '💳' },
  ];

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

        {/* Key Metrics — 3 cards (no Current Usage) */}
        <div className="grid md:grid-cols-3 gap-4">
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
                        <Button variant="outline" size="sm">TNG eWallet</Button>
                        <Button variant="outline" size="sm">Debit Card</Button>
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

        {/* Monthly Bill Preview — Pay Your Bill */}
        <div className="card-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Monthly Bill — May 2025</h2>
            <Badge className="bg-amber-100 text-amber-800 border-amber-200">
              <Clock className="w-3 h-3 mr-1" /> Unpaid
            </Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-power-green/10 rounded-lg border border-power-green/20">
              <p className="text-xs text-muted-foreground mb-1">Community Solar Portion</p>
              <p className="text-2xl font-bold text-power-green">RM {solarCost.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">{solarAllocation} kWh × 44 sen</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
              <p className="text-xs text-muted-foreground mb-1">Grid Electricity Portion</p>
              <p className="text-2xl font-bold text-gray-700">RM {tnbCost.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">{tnbUsage} kWh × {tnbRate.toFixed(2)} sen</p>
            </div>
            <div className="p-4 bg-power-blue/10 rounded-lg border border-power-blue/20">
              <p className="text-xs text-muted-foreground mb-1">Total Amount Due</p>
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
              <span>Total Amount Due</span>
              <span>RM {totalCost.toFixed(2)}</span>
            </div>
          </div>

          {/* Pay Now Button */}
          <div className="mt-6">
            <Dialog open={payOpen} onOpenChange={setPayOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-power-blue hover:bg-power-blue/90 text-white gap-2 h-12 text-base">
                  <CreditCard className="w-5 h-5" /> Pay RM {totalCost.toFixed(2)}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Pay Your Bill</DialogTitle>
                  <DialogDescription>
                    Choose a payment method. You pay the full amount — the solar portion goes to Power Hub and the grid portion goes to TNB, split automatically in the background.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="p-3 bg-power-blue/10 rounded-lg border border-power-blue/20 text-center">
                    <p className="text-xs text-muted-foreground">Amount Due</p>
                    <p className="text-2xl font-bold text-power-blue">RM {totalCost.toFixed(2)}</p>
                  </div>

                  <div className="p-3 bg-secondary/50 rounded-lg border border-border">
                    <Label className="text-xs text-muted-foreground mb-1 block">Service Address Confirmation</Label>
                    <p className="font-medium text-sm">{user.address || 'Address not provided'}</p>
                    <p className="text-xs text-muted-foreground mt-1">Please ensure your address is correct before proceeding.</p>
                  </div>

                  <div>
                    <Label className="mb-2 block">Select Payment Method</Label>
                    <div className="space-y-2">
                      {paymentMethods.map((pm) => (
                        <button
                          key={pm.id}
                          onClick={() => setSelectedPayMethod(pm.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                            selectedPayMethod === pm.id
                              ? 'border-power-blue bg-power-blue/5 ring-2 ring-power-blue/20'
                              : 'border-border hover:border-power-blue/40 hover:bg-secondary/50'
                          }`}
                        >
                          <span className="text-xl">{pm.icon}</span>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{pm.label}</p>
                            <p className="text-xs text-muted-foreground">{pm.desc}</p>
                          </div>
                          {selectedPayMethod === pm.id && (
                            <CheckCircle className="w-5 h-5 text-power-blue" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-xs text-amber-800">
                      <strong>Auto-Pay:</strong> You can also enable auto-deduct from your wallet in{' '}
                      <span className="underline cursor-pointer" onClick={() => { setPayOpen(false); setLocation('/consumer/profile'); }}>
                        Profile Settings
                      </span>
                      .
                    </p>
                  </div>

                  <Button
                    className="w-full bg-power-blue hover:bg-power-blue/90 h-11"
                    disabled={!selectedPayMethod}
                  >
                    Confirm Payment
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-muted-foreground">
              💡 You pay the <strong>full amount</strong> through this app. The payment is automatically split in the background — the community solar portion goes to Power Hub, and the remaining grid electricity portion goes to TNB. This payment flow is proposed subject to regulatory approval and integration with TNB or the relevant electricity utility company.
            </p>
          </div>
        </div>

        {/* Payment History */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Payment History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-right py-3 px-4 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold">Method</th>
                  <th className="text-left py-3 px-4 font-semibold">Reference</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((pay, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-secondary/50">
                    <td className="py-3 px-4">{pay.date}</td>
                    <td className="text-right py-3 px-4 font-semibold">RM {pay.amount.toFixed(2)}</td>
                    <td className="py-3 px-4">{pay.method}</td>
                    <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{pay.ref}</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" /> {pay.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
