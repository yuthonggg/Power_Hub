import { useAuth } from '@/contexts/AuthContext';
import { useEnergy } from '@/contexts/EnergyContext';
import DashboardLayout from '@/components/DashboardLayout';
import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const inventoryHistoryData = [
  { day: 'Day 1', inventory: 35 },
  { day: 'Day 2', inventory: 42 },
  { day: 'Day 3', inventory: 55 },
  { day: 'Day 4', inventory: 48 },
  { day: 'Day 5', inventory: 62 },
  { day: 'Day 6', inventory: 58 },
  { day: 'Day 7', inventory: 65 },
  { day: 'Day 8', inventory: 72 },
  { day: 'Day 9', inventory: 68 },
  { day: 'Day 10', inventory: 75 },
  { day: 'Day 11', inventory: 80 },
  { day: 'Day 12', inventory: 78 },
  { day: 'Day 13', inventory: 85 },
  { day: 'Day 14', inventory: 82 },
  { day: 'Day 15', inventory: 88 },
  { day: 'Day 16', inventory: 92 },
  { day: 'Day 17', inventory: 95 },
  { day: 'Day 18', inventory: 91 },
  { day: 'Day 19', inventory: 87 },
  { day: 'Day 20', inventory: 83 },
  { day: 'Day 21', inventory: 79 },
  { day: 'Day 22', inventory: 75 },
  { day: 'Day 23', inventory: 71 },
  { day: 'Day 24', inventory: 68 },
  { day: 'Day 25', inventory: 65 },
  { day: 'Day 26', inventory: 62 },
  { day: 'Day 27', inventory: 58 },
  { day: 'Day 28', inventory: 55 },
  { day: 'Day 29', inventory: 52 },
  { day: 'Day 30', inventory: 48 },
];

const demandVsSupplyData = [
  { day: 'Day 1', supply: 245, demand: 218 },
  { day: 'Day 2', supply: 252, demand: 225 },
  { day: 'Day 3', supply: 268, demand: 240 },
  { day: 'Day 4', supply: 235, demand: 228 },
  { day: 'Day 5', supply: 280, demand: 245 },
  { day: 'Day 6', supply: 290, demand: 250 },
  { day: 'Day 7', supply: 275, demand: 260 },
  { day: 'Day 8', supply: 310, demand: 280 },
  { day: 'Day 9', supply: 305, demand: 285 },
  { day: 'Day 10', supply: 320, demand: 295 },
  { day: 'Day 11', supply: 335, demand: 310 },
  { day: 'Day 12', supply: 328, demand: 305 },
  { day: 'Day 13', supply: 345, demand: 320 },
  { day: 'Day 14', supply: 340, demand: 315 },
];

const surplusLogData = [
  { date: '2025-05-01', surplus: 125, action: 'Free to Grid', prosumersCapped: 0 },
  { date: '2025-04-30', surplus: 110, action: 'Free to Grid', prosumersCapped: 0 },
  { date: '2025-04-29', surplus: 95, action: 'Stored', prosumersCapped: 0 },
  { date: '2025-04-28', surplus: 140, action: 'Free to Grid', prosumersCapped: 2 },
  { date: '2025-04-27', surplus: 155, action: 'Free to Grid', prosumersCapped: 5 },
];

export default function AdminInventory() {
  const { user, isAuthenticated } = useAuth();
  const { platformInventory } = useEnergy();
  const [, setLocation] = useLocation();
  const [maxCapacity, setMaxCapacity] = useState('10000');
  const [capThreshold, setCapThreshold] = useState('85');

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

  const handleSaveSettings = () => {
    toast.success('Inventory settings updated successfully');
  };

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Inventory Manager</h1>
          <p className="text-muted-foreground">
            Monitor and manage platform energy inventory
          </p>
        </div>

        {/* Settings */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Inventory Settings</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="maxCapacity">Max Inventory Capacity (kWh)</Label>
              <Input
                id="maxCapacity"
                type="number"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="capThreshold">Auto-Cap Threshold (%)</Label>
              <Input
                id="capThreshold"
                type="number"
                min="0"
                max="100"
                value={capThreshold}
                onChange={(e) => setCapThreshold(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
            <p>
              When inventory reaches <strong>{capThreshold}%</strong> of capacity, prosumers will be
              automatically capped to prevent overflow.
            </p>
          </div>

          <Button
            onClick={handleSaveSettings}
            className="mt-4 bg-primary hover:bg-primary/90"
          >
            Save Settings
          </Button>
        </div>

        {/* Inventory History */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Inventory History - Last 30 Days</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={inventoryHistoryData}>
              <defs>
                <linearGradient id="colorInventory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1D9E75" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#1D9E75" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="inventory"
                stroke="#1D9E75"
                fillOpacity={1}
                fill="url(#colorInventory)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Demand vs Supply */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Demand vs Supply - Last 14 Days</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={demandVsSupplyData}>
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

        {/* Surplus Log */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Surplus Log</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-right py-3 px-4 font-semibold">Surplus kWh</th>
                  <th className="text-left py-3 px-4 font-semibold">Action</th>
                  <th className="text-right py-3 px-4 font-semibold">Prosumers Capped</th>
                </tr>
              </thead>
              <tbody>
                {surplusLogData.map((log, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-secondary/50">
                    <td className="py-3 px-4">{log.date}</td>
                    <td className="text-right py-3 px-4 font-semibold">{log.surplus}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={log.action === 'Free to Grid' ? 'secondary' : 'outline'}
                      >
                        {log.action}
                      </Badge>
                    </td>
                    <td className="text-right py-3 px-4">
                      {log.prosumersCapped > 0 ? (
                        <Badge className="bg-red-100 text-red-800">{log.prosumersCapped}</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
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
