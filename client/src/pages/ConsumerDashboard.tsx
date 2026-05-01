import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import EnergyMeter from '@/components/EnergyMeter';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Zap, TrendingDown, Leaf, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const dailyUsageData = [
  { day: 'Mon', solar: 18, grid: 5 },
  { day: 'Tue', solar: 22, grid: 3 },
  { day: 'Wed', solar: 20, grid: 4 },
  { day: 'Thu', solar: 25, grid: 2 },
  { day: 'Fri', solar: 19, grid: 6 },
  { day: 'Sat', solar: 28, grid: 1 },
  { day: 'Sun', solar: 24, grid: 3 },
];

const activityData = [
  { date: '2025-05-01 14:30', kWh: 5.2, amount: 2.29 },
  { date: '2025-05-01 10:15', kWh: 3.8, amount: 1.67 },
  { date: '2025-04-30 18:45', kWh: 7.1, amount: 3.12 },
  { date: '2025-04-30 12:20', kWh: 4.5, amount: 1.98 },
  { date: '2025-04-29 20:00', kWh: 6.3, amount: 2.77 },
];

export default function ConsumerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const navItems = [
    { label: 'Overview', href: '/consumer' },
    { label: 'Subscription Plans', href: '/consumer/plans' },
    { label: 'Usage History', href: '/consumer/usage' },
    { label: 'Account Profile', href: '/consumer/profile' },
    { label: 'Settings', href: '/consumer/settings' },
  ];

  const creditsUsed = 485;
  const creditsTotal = 700;
  const creditsRemaining = creditsTotal - creditsUsed;
  const usagePercent = (creditsUsed / creditsTotal) * 100;

  const wattxCost = creditsUsed * 0.44;
  const tnbCost = creditsUsed * 0.5068;
  const savings = tnbCost - wattxCost;

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">
            You're on the Standard Plan - 700 kWh/month
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Zap}
            label="Active Plan"
            value="Standard"
            unit="700 kWh/mo"
            color="blue"
          />
          <StatCard
            icon={TrendingDown}
            label="Credits Remaining"
            value={creditsRemaining}
            unit="kWh"
            color="green"
          />
          <StatCard
            icon={Leaf}
            label="Savings This Month"
            value={savings.toFixed(2)}
            unit="RM"
            color="amber"
          />
          <StatCard
            label="CO₂ Avoided"
            value={(creditsUsed * 0.585).toFixed(0)}
            unit="kg"
            color="green"
          />
        </div>

        {/* Credit Usage Bar */}
        <div className="card-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Monthly Credit Usage</h2>
            <span className="text-sm text-muted-foreground">
              {creditsUsed} / {creditsTotal} kWh
            </span>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  usagePercent < 70
                    ? 'bg-green-500'
                    : usagePercent < 90
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {((creditsTotal - creditsUsed) / creditsTotal * 100).toFixed(0)}% remaining
            </p>
          </div>
        </div>

        {/* Bill Comparison and Usage Chart */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Bill Comparison */}
          <div className="card-soft p-6">
            <h2 className="text-lg font-semibold mb-6">Bill Comparison</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Power Hub Cost</p>
                <p className="text-2xl font-bold text-power-blue">
                  RM {wattxCost.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">TNB Estimated Cost</p>
                <p className="text-2xl font-bold text-gray-400">
                  RM {tnbCost.toFixed(2)}
                </p>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-1">Your Savings</p>
                <p className="text-3xl font-bold text-green-600">
                  RM {savings.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Daily Usage Chart */}
          <div className="card-soft p-6">
            <h2 className="text-lg font-semibold mb-4">Daily Credit Usage - Last 7 Days</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="solar" fill="#1D9E75" name="Solar Credits" radius={[8, 8, 0, 0]} />
                <Bar dataKey="grid" fill="#9CA3AF" name="Grid" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activityData.map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 hover:bg-secondary/50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-power-blue" />
                  <div>
                    <p className="font-medium">{activity.kWh} kWh used</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
                <p className="font-semibold text-power-blue">
                  -RM {activity.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade CTA */}
        <div className="card-soft p-6 bg-gradient-to-r from-power-blue/10 to-power-green/10 border-2 border-power-blue/20">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Want More Credits?</h3>
              <p className="text-muted-foreground mb-4">
                Upgrade to the Premium Plan for 1,500 kWh/month and save even more.
              </p>
              <Button className="bg-power-blue hover:bg-power-blue/90">
                View Premium Plan
              </Button>
            </div>
            <AlertCircle className="w-6 h-6 text-power-blue flex-shrink-0" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
