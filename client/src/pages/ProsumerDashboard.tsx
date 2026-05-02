import { useAuth } from '@/contexts/AuthContext';
import { useEnergy } from '@/contexts/EnergyContext';
import DashboardLayout from '@/components/DashboardLayout';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { Sun, TrendingUp, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const monthlyExportData = [
  { day: '1', kwh: 5.2 },
  { day: '2', kwh: 6.1 },
  { day: '3', kwh: 5.8 },
  { day: '4', kwh: 7.2 },
  { day: '5', kwh: 6.5 },
  { day: '6', kwh: 8.1 },
  { day: '7', kwh: 7.9 },
  { day: '8', kwh: 6.3 },
  { day: '9', kwh: 5.7 },
  { day: '10', kwh: 7.4 },
];

export default function ProsumerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const { currentGeneration } = useEnergy();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'prosumer') {
      setLocation('/login');
    }
  }, [isAuthenticated, user, setLocation]);

  if (!isAuthenticated || !user || user.role !== 'prosumer') {
    return null;
  }

  const navItems = [
    { label: 'Overview', href: '/prosumer' },
    { label: 'Exports', href: '/prosumer/exports' },
    { label: 'Earnings', href: '/prosumer/earnings' },
    { label: 'Profile', href: '/prosumer/profile' },
  ];

  const todayExport = 6.8;
  const monthlyEarnings = (currentGeneration * 30 * 0.34).toFixed(2);

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Solar Dashboard</h1>
          <p className="text-muted-foreground">Monitor your energy exports and earnings</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Today's Export */}
          <div className="card-soft p-6 border-l-4 border-power-green">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Today's Export</p>
                <p className="text-3xl font-bold text-power-green">{todayExport} kWh</p>
              </div>
              <Sun className="w-8 h-8 text-power-green/50" />
            </div>
          </div>

          {/* Monthly Earnings */}
          <div className="card-soft p-6 border-l-4 border-power-amber">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">This Month's Earnings</p>
                <p className="text-3xl font-bold text-power-amber">RM {monthlyEarnings}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-power-amber/50" />
            </div>
          </div>

          {/* Wallet Balance */}
          <div className="card-soft p-6 border-l-4 border-power-blue">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Wallet Balance</p>
                <p className="text-3xl font-bold text-power-blue">RM {user.eWalletBalance.toFixed(2)}</p>
              </div>
              <Wallet className="w-8 h-8 text-power-blue/50" />
            </div>
            <Button variant="outline" size="sm" className="mt-4 w-full">
              Withdraw
            </Button>
          </div>
        </div>

        {/* Export History Chart */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Daily Export - Last 10 Days</h2>
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
              />
            </LineChart>
          </ResponsiveContainer>
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
                <span className="text-muted-foreground">Monthly Limit</span>
                <span className="font-medium">{user.monthlyExportLimitKwh} kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rate</span>
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
                <span className={`font-medium ${user.exportEnabled ? 'text-power-green' : 'text-red-500'}`}>
                  {user.exportEnabled ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
