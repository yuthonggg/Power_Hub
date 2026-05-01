import { useAuth } from '@/contexts/AuthContext';
import { useEnergy } from '@/contexts/EnergyContext';
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Zap,
  TrendingUp,
  Wallet,
  AlertCircle,
  CheckCircle,
  Leaf,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const generationData = [
  { time: '6am', kWh: 0.1 },
  { time: '9am', kWh: 2.5 },
  { time: '12pm', kWh: 5.5 },
  { time: '3pm', kWh: 4.2 },
  { time: '6pm', kWh: 1.8 },
  { time: '9pm', kWh: 0 },
];

const monthlyData = [
  { month: 'Jan', earnings: 320 },
  { month: 'Feb', earnings: 380 },
  { month: 'Mar', earnings: 450 },
  { month: 'Apr', earnings: 520 },
  { month: 'May', earnings: 580 },
  { month: 'Jun', earnings: 620 },
];

const transactionData = [
  {
    id: 1,
    date: '2025-05-01',
    type: 'Export',
    kWh: 15.2,
    rate: 0.34,
    amount: 5.17,
    status: 'completed',
  },
  {
    id: 2,
    date: '2025-04-30',
    type: 'Export',
    kWh: 18.5,
    rate: 0.34,
    amount: 6.29,
    status: 'completed',
  },
  {
    id: 3,
    date: '2025-04-29',
    type: 'Free to Grid',
    kWh: 8.3,
    rate: 0,
    amount: 0,
    status: 'completed',
  },
];

export default function ProsumerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const { currentGeneration, batteryLevel, startSimulation } = useEnergy();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    } else {
      startSimulation();
    }
  }, [isAuthenticated, setLocation, startSimulation]);

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

  const todayGeneration = 42.5;
  const todayExported = 38.2;
  const todayEarnings = 13.0;

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">
            Your solar system is performing well today
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Zap}
            label="Generated Today"
            value={todayGeneration}
            unit="kWh"
            color="green"
          />
          <StatCard
            icon={TrendingUp}
            label="Exported Today"
            value={todayExported}
            unit="kWh"
            color="amber"
          />
          <StatCard
            icon={Wallet}
            label="Earnings Today"
            value={todayEarnings.toFixed(2)}
            unit="RM"
            color="green"
          />
          <div className="card-soft p-6 flex flex-col items-center justify-center">
            <EnergyMeter
              value={batteryLevel * 10}
              label="Battery Level"
              color="blue"
              size="sm"
            />
          </div>
        </div>

        {/* Status Panel and Charts */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Generation Chart */}
          <div className="lg:col-span-2 card-soft p-6">
            <h2 className="text-lg font-semibold mb-4">Today's Generation</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={generationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="kWh" fill="#1D9E75" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status Panel */}
          <div className="card-soft p-6 space-y-4">
            <h2 className="text-lg font-semibold">Status</h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">
                  <strong>Active</strong> - Exporting energy
                </span>
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">Current Rate</p>
                <p className="text-2xl font-bold text-power-green">34 sen/kWh</p>
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Platform Inventory</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{ width: '65%' }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">65% Full</p>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 mt-4">
                View Exports
              </Button>
            </div>
          </div>
        </div>

        {/* Monthly Earnings Chart */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Earnings</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#1D9E75"
                strokeWidth={2}
                dot={{ fill: '#1D9E75', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Transactions */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Type</th>
                  <th className="text-right py-3 px-4 font-semibold">kWh</th>
                  <th className="text-right py-3 px-4 font-semibold">Rate</th>
                  <th className="text-right py-3 px-4 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactionData.map((tx) => (
                  <tr key={tx.id} className="border-b border-border hover:bg-secondary/50">
                    <td className="py-3 px-4">{tx.date}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={tx.type === 'Free to Grid' ? 'secondary' : 'default'}
                      >
                        {tx.type}
                      </Badge>
                    </td>
                    <td className="text-right py-3 px-4">{tx.kWh}</td>
                    <td className="text-right py-3 px-4">
                      {tx.rate > 0 ? `${(tx.rate * 100).toFixed(0)} sen` : '—'}
                    </td>
                    <td className="text-right py-3 px-4 font-semibold">
                      {tx.amount > 0 ? `RM ${tx.amount.toFixed(2)}` : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">
                        {tx.status === 'completed' ? '✓ Completed' : 'Pending'}
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
