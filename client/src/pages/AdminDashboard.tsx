import { useAuth } from '@/contexts/AuthContext';
import { useEnergy } from '@/contexts/EnergyContext';
import DashboardLayout from '@/components/DashboardLayout';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { Users, Zap, TrendingUp, AlertCircle, Activity, Wallet, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const supplyDemandData = [
  { day: '1', supply: 245, demand: 218 },
  { day: '2', supply: 252, demand: 225 },
  { day: '3', supply: 268, demand: 240 },
  { day: '4', supply: 235, demand: 228 },
  { day: '5', supply: 280, demand: 245 },
  { day: '6', supply: 290, demand: 250 },
  { day: '7', supply: 275, demand: 260 },
  { day: '8', supply: 310, demand: 280 },
  { day: '9', supply: 305, demand: 285 },
  { day: '10', supply: 320, demand: 295 },
];

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const { platformInventory, startSimulation, lastUpdateTime } = useEnergy();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      setLocation('/login');
    } else {
      startSimulation();
    }
  }, [isAuthenticated, user, setLocation, startSimulation]);

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return null;
  }

  const navItems = [
    { label: 'Overview', href: '/admin' },
    { label: 'Pricing Control', href: '/admin/pricing' },
    { label: 'User Management', href: '/admin/users' },
    { label: 'Inventory Management', href: '/admin/inventory' },
  ];

  // Revenue calculations
  const totalEnergyTraded = 2850; // kWh this month
  const consumerRate = 44; // sen/kWh (what consumers pay)
  const prosumerRate = 34; // sen/kWh (what prosumers receive)
  const platformMargin = consumerRate - prosumerRate; // 10 sen/kWh

  const totalConsumerRevenue = totalEnergyTraded * consumerRate / 100;
  const totalProsumerPayout = totalEnergyTraded * prosumerRate / 100;
  const platformProfit = totalEnergyTraded * platformMargin / 100;

  // TNB split billing data
  const totalConsumerUsage = 8500; // total kWh consumed by all consumers
  const solarAllocated = totalEnergyTraded; // kWh allocated from solar
  const tnbUsage = totalConsumerUsage - solarAllocated; // remaining on TNB

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Platform Overview</h1>
          <p className="text-muted-foreground">Monitor platform health, revenue, and TNB partnership billing</p>
        </div>

        {/* Live Status */}
        <div className="flex items-center gap-2 p-3 bg-power-amber/10 rounded-lg border border-power-amber/20">
          <Activity className="w-4 h-4 text-power-amber animate-pulse" />
          <span className="text-sm text-power-amber font-medium">Live • Updated {lastUpdateTime}</span>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card-soft p-6 border-l-4 border-power-green">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Prosumers</p>
                <p className="text-3xl font-bold text-power-green">145</p>
              </div>
              <Zap className="w-8 h-8 text-power-green/50" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">+12 this month</p>
          </div>

          <div className="card-soft p-6 border-l-4 border-power-blue">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Consumers</p>
                <p className="text-3xl font-bold text-power-blue">328</p>
              </div>
              <Users className="w-8 h-8 text-power-blue/50" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">+28 this month</p>
          </div>

          <div className="card-soft p-6 border-l-4 border-power-amber">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Rate</p>
                <p className="text-3xl font-bold text-power-amber">44 sen</p>
              </div>
              <TrendingUp className="w-8 h-8 text-power-amber/50" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">per kWh (range: 42–46)</p>
          </div>
        </div>

        {/* Revenue Split — Platform Economics */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Revenue Split</h2>
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="p-4 bg-power-blue/10 rounded-lg border border-power-blue/20">
              <p className="text-xs text-muted-foreground mb-1">Consumer Payments</p>
              <p className="text-2xl font-bold text-power-blue">RM {totalConsumerRevenue.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">{totalEnergyTraded} kWh × 44 sen</p>
            </div>
            <div className="p-4 bg-power-green/10 rounded-lg border border-power-green/20">
              <p className="text-xs text-muted-foreground mb-1">Prosumer Earnings</p>
              <p className="text-2xl font-bold text-power-green">RM {totalProsumerPayout.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">{totalEnergyTraded} kWh × 34 sen</p>
            </div>
            <div className="p-4 bg-power-amber/10 rounded-lg border border-power-amber/20">
              <p className="text-xs text-muted-foreground mb-1">Platform Margin</p>
              <p className="text-2xl font-bold text-power-amber">RM {platformProfit.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">{totalEnergyTraded} kWh × 10 sen</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
              <p className="text-xs text-muted-foreground mb-1">CO₂ Avoided</p>
              <p className="text-2xl font-bold text-gray-700">{(totalEnergyTraded * 0.585).toFixed(0)} kg</p>
              <p className="text-xs text-muted-foreground mt-1">0.585 kg/kWh factor</p>
            </div>
          </div>

          {/* Margin Breakdown */}
          <div className="space-y-2 text-sm border-t border-border pt-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Consumer pays</span>
              <span className="font-medium">44 sen/kWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Prosumer receives</span>
              <span className="font-medium text-power-green">34 sen/kWh</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-semibold">
              <span>Platform margin</span>
              <span className="text-power-amber">10 sen/kWh</span>
            </div>
          </div>
        </div>

        {/* TNB Partnership — Billing Split */}
        <div className="card-soft p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-power-blue" />
            <h2 className="text-lg font-semibold">TNB Partnership — Billing Split</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Consumer bills are split between Power Hub and TNB. This section tracks the total energy allocation and payment flow.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-power-green/10 rounded-lg border border-power-green/20">
              <p className="text-xs text-muted-foreground mb-1">Power Hub Portion</p>
              <p className="text-2xl font-bold text-power-green">{solarAllocated.toLocaleString()} kWh</p>
              <p className="text-xs text-muted-foreground mt-1">RM {(solarAllocated * 0.44).toFixed(2)} billed</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
              <p className="text-xs text-muted-foreground mb-1">TNB Grid Portion</p>
              <p className="text-2xl font-bold text-gray-700">{tnbUsage.toLocaleString()} kWh</p>
              <p className="text-xs text-muted-foreground mt-1">Billed by TNB directly</p>
            </div>
            <div className="p-4 bg-power-blue/10 rounded-lg border border-power-blue/20">
              <p className="text-xs text-muted-foreground mb-1">Total Consumer Usage</p>
              <p className="text-2xl font-bold text-power-blue">{totalConsumerUsage.toLocaleString()} kWh</p>
              <p className="text-xs text-muted-foreground mt-1">{((solarAllocated / totalConsumerUsage) * 100).toFixed(1)}% from solar</p>
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-muted-foreground">
              💡 <strong>TNB Partnership:</strong> Consumer payments are automatically split — Power Hub deducts the solar portion from consumer wallets, while the remaining grid usage is processed through TNB's integrated payment gateway. Revenue reconciliation happens monthly.
            </p>
          </div>
        </div>

        {/* Supply vs Demand */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Supply vs Demand — Last 10 Days</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={supplyDemandData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="supply"
                stroke="#1D9E75"
                strokeWidth={2}
                name="Prosumer Supply (kWh/day)"
              />
              <Line
                type="monotone"
                dataKey="demand"
                stroke="#378ADD"
                strokeWidth={2}
                name="Consumer Demand (kWh/day)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card-soft p-6">
            <h3 className="font-semibold mb-4">Pricing Control</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Adjust monthly rates using the formula: P = 44 + 2 × ((D−S)/D)
            </p>
            <Button className="w-full bg-power-amber hover:bg-power-amber/90" onClick={() => setLocation('/admin/pricing')}>
              Manage Pricing
            </Button>
          </div>

          <div className="card-soft p-6">
            <h3 className="font-semibold mb-4">User Management</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Review users, verify accounts, and set prosumer export limits
            </p>
            <Button className="w-full bg-power-blue hover:bg-power-blue/90" onClick={() => setLocation('/admin/users')}>
              Manage Users
            </Button>
          </div>

          <div className="card-soft p-6 flex flex-col">
            <h3 className="font-semibold mb-4">Energy Pool</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Monitor solar pool capacity and subscription limits to ensure platform stability
            </p>
            <Button className="w-full bg-power-green hover:bg-power-green/90 mt-auto" onClick={() => setLocation('/admin/inventory')}>
              Manage Pool
            </Button>
          </div>
        </div>

        {/* Wallet Overview */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card-soft p-6">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="w-5 h-5 text-power-green" />
              <h3 className="font-semibold">Platform Wallet Summary</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Consumer Wallets</span>
                <span className="font-medium">RM 45,230.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Prosumer Wallets</span>
                <span className="font-medium">RM 28,750.25</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Deposits (This Month)</span>
                <span className="font-medium text-power-green">RM 12,450.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Withdrawals (This Month)</span>
                <span className="font-medium text-red-500">RM 8,320.00</span>
              </div>
            </div>
          </div>

          <div className="card-soft p-6">
            <h3 className="font-semibold mb-3">System Health</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">API Status</span>
                <Badge className="bg-green-100 text-green-800">Operational</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">TNB Integration</span>
                <Badge className="bg-green-100 text-green-800">Connected</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Payment Gateway</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Uptime</span>
                <Badge className="bg-green-100 text-green-800">99.9%</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
