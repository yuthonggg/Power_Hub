import { useAuth } from '@/contexts/AuthContext';
import { useEnergy } from '@/contexts/EnergyContext';
import DashboardLayout from '@/components/DashboardLayout';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { Users, Zap, TrendingUp, AlertCircle, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
    { label: 'Pricing', href: '/admin/pricing' },
    { label: 'Users', href: '/admin/users' },
    { label: 'Inventory', href: '/admin/inventory' },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Platform Overview</h1>
          <p className="text-muted-foreground">Monitor platform health and key metrics</p>
        </div>

        {/* Live Status */}
        <div className="flex items-center gap-2 p-3 bg-power-amber/10 rounded-lg border border-power-amber/20">
          <Activity className="w-4 h-4 text-power-amber animate-pulse" />
          <span className="text-sm text-power-amber font-medium">Live • Updated {lastUpdateTime}</span>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4">
          {/* Total Prosumers */}
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

          {/* Total Consumers */}
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

          {/* Current Rate */}
          <div className="card-soft p-6 border-l-4 border-power-amber">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Rate</p>
                <p className="text-3xl font-bold text-power-amber">44 sen</p>
              </div>
              <TrendingUp className="w-8 h-8 text-power-amber/50" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">per kWh</p>
          </div>

          {/* Live Inventory Status */}
          <div className="card-soft p-6 border-l-4 border-power-purple">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Inventory</p>
                <p className="text-3xl font-bold text-power-purple">{platformInventory.toFixed(0)}%</p>
              </div>
              <AlertCircle className="w-8 h-8 text-power-purple/50" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Real-time</p>
          </div>
        </div>

        {/* Supply vs Demand */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Supply vs Demand - Last 10 Days</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={supplyDemandData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="supply"
                stroke="#1D9E75"
                strokeWidth={2}
                name="Prosumer Supply (kWh/h)"
              />
              <Line
                type="monotone"
                dataKey="demand"
                stroke="#378ADD"
                strokeWidth={2}
                name="Consumer Demand (kWh/h)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card-soft p-6">
            <h3 className="font-semibold mb-4">Pricing Control</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Adjust monthly rates and review pricing formula
            </p>
            <Button className="w-full bg-power-amber hover:bg-power-amber/90">
              Manage Pricing
            </Button>
          </div>

          <div className="card-soft p-6">
            <h3 className="font-semibold mb-4">User Management</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Review users, verify accounts, and manage access
            </p>
            <Button className="w-full bg-power-blue hover:bg-power-blue/90">
              Manage Users
            </Button>
          </div>

          <div className="card-soft p-6">
            <h3 className="font-semibold mb-4">Inventory Manager</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Monitor energy pool and set export limits
            </p>
            <Button className="w-full bg-power-green hover:bg-power-green/90">
              Manage Inventory
            </Button>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card-soft p-6">
            <h3 className="font-semibold mb-3">Monthly Metrics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Energy Traded</span>
                <span className="font-medium">2,850 kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Revenue</span>
                <span className="font-medium text-power-green">RM 1,254</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg. Rate</span>
                <span className="font-medium">44 sen/kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">CO₂ Avoided</span>
                <span className="font-medium">1,667 kg</span>
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
                <span className="text-muted-foreground">Database</span>
                <Badge className="bg-green-100 text-green-800">Healthy</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Uptime</span>
                <Badge className="bg-green-100 text-green-800">99.9%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Last Sync</span>
                <span className="font-medium">2 min ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
