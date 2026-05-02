import { useAuth } from '@/contexts/AuthContext';
import { useEnergy } from '@/contexts/EnergyContext';
import DashboardLayout from '@/components/DashboardLayout';
import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import { Sun, TrendingUp, Wallet, Activity, Zap, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const monthlyExportData = [
  { day: '1', kwh: 5.2, earnings: 1.77 },
  { day: '2', kwh: 6.1, earnings: 2.07 },
  { day: '3', kwh: 5.8, earnings: 1.97 },
  { day: '4', kwh: 7.2, earnings: 2.45 },
  { day: '5', kwh: 6.5, earnings: 2.21 },
  { day: '6', kwh: 8.1, earnings: 2.75 },
  { day: '7', kwh: 7.9, earnings: 2.69 },
  { day: '8', kwh: 6.3, earnings: 2.14 },
  { day: '9', kwh: 5.7, earnings: 1.94 },
  { day: '10', kwh: 7.4, earnings: 2.52 },
];

const recentTransactions = [
  { date: '2025-05-01', kwh: 8.3, earnings: 2.82, status: 'Sold' },
  { date: '2025-04-30', kwh: 7.1, earnings: 2.41, status: 'Sold' },
  { date: '2025-04-29', kwh: 9.4, earnings: 3.20, status: 'Sold' },
  { date: '2025-04-28', kwh: 6.7, earnings: 2.28, status: 'Sold' },
  { date: '2025-04-27', kwh: 8.8, earnings: 2.99, status: 'Sold' },
];

export default function ProsumerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const { currentGeneration, startSimulation, lastUpdateTime } = useEnergy();
  const [, setLocation] = useLocation();
  const [exportEnabled, setExportEnabled] = useState(true);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'prosumer') {
      setLocation('/login');
    } else {
      startSimulation();
    }
  }, [isAuthenticated, user, setLocation, startSimulation]);

  if (!isAuthenticated || !user || user.role !== 'prosumer') {
    return null;
  }

  const navItems = [
    { label: 'Overview', href: '/prosumer' },
    { label: 'Earnings', href: '/prosumer/earnings' },
    { label: 'Solar Profile', href: '/prosumer/profile' },
    { label: 'Account Profile', href: '/prosumer/account' },
  ];

  const currentEarningsRate = (currentGeneration * 0.34).toFixed(2);
  const monthExportedKwh = monthlyExportData.reduce((sum, d) => sum + d.kwh, 0);
  const monthEarnings = (monthExportedKwh * 0.34).toFixed(2);

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Solar Dashboard</h1>
          <p className="text-muted-foreground">Monitor your energy exports and earnings</p>
        </div>

        {/* Live Status + Export Toggle */}
        <div className="card-soft p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-power-green animate-pulse" />
              <span className="text-sm text-power-green font-medium">Live • Updated {lastUpdateTime}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Export to Power Hub</span>
              <Switch
                checked={exportEnabled}
                onCheckedChange={setExportEnabled}
              />
            </div>
          </div>
          {!exportEnabled && (
            <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800">
                ⚠️ Exports are currently disabled.
              </p>
            </div>
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-4">

          {/* Current Earnings Rate */}
          <div className="card-soft p-6 border-l-4 border-power-amber">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Earnings Rate</p>
                <p className="text-3xl font-bold text-power-amber">RM {currentEarningsRate}</p>
                <p className="text-xs text-muted-foreground mt-1">per hour • 34 sen/kWh</p>
              </div>
              <TrendingUp className="w-8 h-8 text-power-amber/50" />
            </div>
          </div>

          {/* This Month */}
          <div className="card-soft p-6 border-l-4 border-power-blue">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">This Month</p>
                <p className="text-3xl font-bold text-power-blue">RM {monthEarnings}</p>
                <p className="text-xs text-muted-foreground mt-1">{monthExportedKwh.toFixed(1)} kWh exported</p>
              </div>
              <Zap className="w-8 h-8 text-power-blue/50" />
            </div>
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
              {/* Deposit Dialog */}
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
                      <Label htmlFor="deposit-amount">Deposit Amount (RM)</Label>
                      <Input id="deposit-amount" type="number" placeholder="Minimum RM 10.00" min="10" className="mt-1" />
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

              {/* Withdraw Dialog */}
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
                      <Label htmlFor="withdraw-amount">Withdraw Amount (RM)</Label>
                      <Input id="withdraw-amount" type="number" placeholder="Minimum RM 10.00" min="10" max={user.eWalletBalance} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="bank">Bank Name</Label>
                      <Input id="bank" placeholder="e.g., Maybank, CIMB" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="account">Account Number</Label>
                      <Input id="account" placeholder="Your bank account number" className="mt-1" />
                    </div>
                    <p className="text-xs text-muted-foreground">Processing time: 1–3 business days</p>
                    <Button className="w-full bg-power-green hover:bg-power-green/90">Confirm Withdrawal</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Export History Chart */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Daily Export & Earnings — Last 10 Days</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyExportData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="kwh"
                stroke="#1D9E75"
                strokeWidth={2}
                dot={{ fill: '#1D9E75', r: 4 }}
                name="kWh Exported"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Transactions — All Auto-Sold */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          <p className="text-sm text-muted-foreground mb-4">
            All exported energy is automatically sold through Power Hub at <strong>34 sen/kWh</strong>. Earnings are credited to your wallet instantly.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-right py-3 px-4 font-semibold">Energy Sold</th>
                  <th className="text-right py-3 px-8 font-semibold">Earnings</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-secondary/50">
                    <td className="py-3 px-4">{tx.date}</td>
                    <td className="text-right py-3 px-4 font-semibold">{tx.kwh} kWh</td>
                    <td className="text-right py-3 px-8 font-semibold text-power-green">RM {tx.earnings.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        ✓ {tx.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card-soft p-6">
            <h3 className="font-semibold mb-3">System Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Capacity</span>
                <span className="font-medium">{user.solarCapacityKwp} kWp</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Panel Count</span>
                <span className="font-medium">{user.panelCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Export Limit</span>
                <span className="font-medium">{user.monthlyExportLimitKwh} kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Power Hub Rate</span>
                <span className="font-medium text-power-green">34 sen/kWh</span>
              </div>
            </div>
          </div>

          <div className="card-soft p-6">
            <h3 className="font-semibold mb-3">Lifetime Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Exported</span>
                <span className="font-medium">{user.totalExportedKwh?.toLocaleString()} kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Earnings</span>
                <span className="font-medium text-power-green">RM {user.totalEarningsRM?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Export Status</span>
                <span className={`font-medium ${exportEnabled ? 'text-power-green' : 'text-red-500'}`}>
                  {exportEnabled ? 'Active — Selling to Power Hub' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
