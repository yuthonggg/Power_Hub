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
} from 'recharts';
import { Users, Zap, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const freeToGridData = [
  { day: 'Mon', kWh: 120 },
  { day: 'Tue', kWh: 95 },
  { day: 'Wed', kWh: 140 },
  { day: 'Thu', kWh: 110 },
  { day: 'Fri', kWh: 105 },
  { day: 'Sat', kWh: 130 },
  { day: 'Sun', kWh: 125 },
];

const inventoryData = [
  { day: 'Day 1', inventory: 35 },
  { day: 'Day 2', inventory: 42 },
  { day: 'Day 3', inventory: 55 },
  { day: 'Day 4', inventory: 48 },
  { day: 'Day 5', inventory: 62 },
  { day: 'Day 6', inventory: 58 },
  { day: 'Day 7', inventory: 65 },
];

const alerts = [
  {
    type: 'warning',
    title: 'Inventory Above Threshold',
    message: 'Platform inventory at 65% - approaching cap threshold (85%)',
  },
  {
    type: 'error',
    title: 'Payout Failed',
    message: '3 prosumers have pending payouts exceeding 48 hours',
  },
  {
    type: 'success',
    title: 'System Operating Normally',
    message: 'All systems green. No critical issues detected.',
  },
];

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const { platformInventory } = useEnergy();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      setLocation('/login');
    }
  }, [isAuthenticated, user, setLocation]);

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return null;
  }

  const navItems = [
    { label: 'Overview', href: '/admin' },
    { label: 'Pricing Control', href: '/admin/pricing' },
    { label: 'User Management', href: '/admin/users' },
    { label: 'Inventory Manager', href: '/admin/inventory' },
    { label: 'Reports', href: '/admin/reports' },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Platform Overview</h1>
          <p className="text-muted-foreground">
            Real-time monitoring and control of Power Hub operations
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            icon={Users}
            label="Total Prosumers"
            value="342"
            color="green"
          />
          <StatCard
            icon={Users}
            label="Total Consumers"
            value="1,248"
            color="blue"
          />
          <StatCard
            label="Platform Revenue"
            value="RM 4,520"
            unit="Today"
            color="amber"
          />
          <StatCard
            icon={Zap}
            label="Total kWh Traded"
            value="45,230"
            color="green"
          />
          <StatCard
            label="Inventory Level"
            value={platformInventory.toFixed(0)}
            unit="%"
            color={platformInventory > 85 ? 'red' : platformInventory > 70 ? 'amber' : 'green'}
          />
        </div>

        {/* Live Energy Flow and Inventory Gauge */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Live Energy Flow */}
          <div className="lg:col-span-2 card-soft p-6">
            <h2 className="text-lg font-semibold mb-6">Live Energy Flow</h2>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-16 h-16 bg-power-green/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-8 h-8 text-power-green" />
                </div>
                <p className="font-semibold">Prosumers</p>
                <p className="text-sm text-muted-foreground">342 active</p>
                <p className="text-lg font-bold text-power-green mt-2">245 kWh/h</p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Exporting</p>
                  <div className="text-2xl">→</div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-power-amber/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-8 h-8 text-power-amber" />
                </div>
                <p className="font-semibold">Platform</p>
                <p className="text-sm text-muted-foreground">Inventory</p>
                <p className="text-lg font-bold text-power-amber mt-2">
                  {platformInventory.toFixed(0)}%
                </p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Supplying</p>
                  <div className="text-2xl">→</div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-power-blue/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-8 h-8 text-power-blue" />
                </div>
                <p className="font-semibold">Consumers</p>
                <p className="text-sm text-muted-foreground">1,248 active</p>
                <p className="text-lg font-bold text-power-blue mt-2">218 kWh/h</p>
              </div>
            </div>
          </div>

          {/* Inventory Gauge */}
          <div className="card-soft p-6 flex flex-col items-center justify-center">
            <EnergyMeter
              value={platformInventory}
              label="Platform Inventory"
              color={platformInventory > 85 ? 'red' : platformInventory > 70 ? 'amber' : 'green'}
              size="lg"
            />
            {platformInventory > 85 && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg text-center">
                <p className="text-xs font-semibold text-red-600">
                  ⚠️ Auto-cap active - prosumers capped
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Alerts */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Active Alerts</h2>
          <div className="space-y-3">
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'error'
                    ? 'bg-red-50 border-red-500'
                    : alert.type === 'warning'
                    ? 'bg-amber-50 border-amber-500'
                    : 'bg-green-50 border-green-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  {alert.type === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  {alert.type === 'warning' && (
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  )}
                  {alert.type === 'success' && (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p
                      className={`font-semibold ${
                        alert.type === 'error'
                          ? 'text-red-900'
                          : alert.type === 'warning'
                          ? 'text-amber-900'
                          : 'text-green-900'
                      }`}
                    >
                      {alert.title}
                    </p>
                    <p
                      className={`text-sm mt-1 ${
                        alert.type === 'error'
                          ? 'text-red-700'
                          : alert.type === 'warning'
                          ? 'text-amber-700'
                          : 'text-green-700'
                      }`}
                    >
                      {alert.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grid Export Tracker */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Grid Export Tracker</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Free-to-Grid (Lifetime)</p>
              <p className="text-3xl font-bold text-power-green">8,420 kWh</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Today's Free-to-Grid</p>
              <p className="text-3xl font-bold text-power-amber">125 kWh</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={freeToGridData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="kWh" fill="#EF9F27" name="Free to Grid" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory History */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Inventory History - Last 7 Days</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={inventoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="inventory"
                stroke="#1D9E75"
                strokeWidth={2}
                dot={{ fill: '#1D9E75', r: 4 }}
                name="Inventory %"
              />
              <Line
                type="monotone"
                dataKey={() => 85}
                stroke="#EF9F27"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Cap Threshold"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}
