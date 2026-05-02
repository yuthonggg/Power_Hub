import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { Zap, TrendingDown, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'consumer') {
      setLocation('/login');
    }
  }, [isAuthenticated, user, setLocation]);

  if (!isAuthenticated || !user || user.role !== 'consumer') {
    return null;
  }

  const navItems = [
    { label: 'Overview', href: '/consumer' },
    { label: 'Plans', href: '/consumer/plans' },
    { label: 'Usage', href: '/consumer/usage' },
    { label: 'Profile', href: '/consumer/profile' },
  ];

  const monthlyUsage = 300;
  const monthlyRate = 44;
  const monthlyCost = (monthlyUsage * monthlyRate / 100).toFixed(2);
  const savings = ((monthlyUsage * 0.5068 - monthlyUsage * 0.44) * 100 / 100).toFixed(2);

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Energy Dashboard</h1>
          <p className="text-muted-foreground">Manage your solar subscription and usage</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Current Usage */}
          <div className="card-soft p-6 border-l-4 border-power-blue">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">This Month's Usage</p>
                <p className="text-3xl font-bold text-power-blue">{monthlyUsage} kWh</p>
              </div>
              <Zap className="w-8 h-8 text-power-blue/50" />
            </div>
          </div>

          {/* Monthly Cost */}
          <div className="card-soft p-6 border-l-4 border-power-green">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Monthly Cost</p>
                <p className="text-3xl font-bold text-power-green">RM {monthlyCost}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-power-green/50" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">at 44 sen/kWh</p>
          </div>

          {/* Monthly Savings */}
          <div className="card-soft p-6 border-l-4 border-power-amber">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Monthly Savings</p>
                <p className="text-3xl font-bold text-power-amber">RM {savings}</p>
              </div>
              <Leaf className="w-8 h-8 text-power-amber/50" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">vs TNB rate</p>
          </div>
        </div>

        {/* Subscription Status */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Active Subscription</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Plan</p>
                  <p className="text-xl font-semibold">{user.activeSubscriptionPlan || 'Plus'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Monthly Allocation</p>
                  <p className="text-xl font-semibold text-power-green">{monthlyUsage} kWh</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Rate</p>
                  <p className="text-xl font-semibold">{monthlyRate} sen/kWh</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Status</p>
                <Badge className="bg-power-green text-white">Active</Badge>
              </div>
              <Button variant="outline" className="w-full">
                Manage Subscription
              </Button>
            </div>
          </div>
        </div>

        {/* Usage History Chart */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Daily Usage - Last 10 Days</h2>
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

        {/* Wallet & Payment */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card-soft p-6">
            <h3 className="font-semibold mb-3">Wallet</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Balance</p>
                <p className="text-2xl font-bold text-power-blue">RM {user.eWalletBalance.toFixed(2)}</p>
              </div>
              <Button className="w-full bg-power-blue hover:bg-power-blue/90">
                Top Up
              </Button>
            </div>
          </div>

          <div className="card-soft p-6">
            <h3 className="font-semibold mb-3">Next Payment</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Due Amount</p>
                <p className="text-2xl font-bold text-power-green">RM {monthlyCost}</p>
              </div>
              <Button className="w-full bg-power-green hover:bg-power-green/90">
                Pay Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
