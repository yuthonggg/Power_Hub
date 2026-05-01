import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Zap, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

const forecastData = [
  { day: 'Today', kWh: 42.5 },
  { day: 'Tomorrow', kWh: 45.2 },
  { day: 'Day 3', kWh: 38.8 },
  { day: 'Day 4', kWh: 48.1 },
  { day: 'Day 5', kWh: 41.3 },
  { day: 'Day 6', kWh: 44.9 },
  { day: 'Day 7', kWh: 46.5 },
];

const matchesData = [
  {
    id: 'CONS_0234',
    accountType: 'High-usage Home',
    kwhAllocated: 15.2,
    since: '2025-04-15',
  },
  {
    id: 'CONS_0891',
    accountType: 'Shoplet',
    kwhAllocated: 12.8,
    since: '2025-04-20',
  },
  {
    id: 'CONS_1245',
    accountType: 'Office',
    kwhAllocated: 10.2,
    since: '2025-04-25',
  },
];

const freeEnergyLog = [
  { date: '2025-05-01', kWh: 8.3, reason: 'No active buyers' },
  { date: '2025-04-30', kWh: 5.1, reason: 'Battery full' },
  { date: '2025-04-29', kWh: 12.4, reason: 'No active buyers' },
  { date: '2025-04-28', kWh: 3.7, reason: 'Battery full' },
];

export default function ProsumerExports() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [exportEnabled, setExportEnabled] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);

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

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Energy Exports</h1>
          <p className="text-muted-foreground">
            Manage your solar energy exports to the Power Hub platform
          </p>
        </div>

        {/* Export Control */}
        <div className="card-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Export Energy to Power Hub</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Toggle to enable/disable energy exports
              </p>
            </div>
            <Switch
              checked={exportEnabled}
              onCheckedChange={setExportEnabled}
            />
          </div>

          <div className="pt-4 border-t border-border space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Rate</p>
              <p className="text-2xl font-bold text-power-green">34 sen/kWh</p>
            </div>
            {!exportEnabled && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800">
                  ⚠️ Exports are currently disabled. Toggle above to resume.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Forecast Chart */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">
            Projected Exportable Energy — Next 7 Days
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="kWh" fill="#1D9E75" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Subscription Matches */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">
            Consumers Currently Using Your Energy
          </h2>
          {matchesData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Consumer ID</th>
                    <th className="text-left py-3 px-4 font-semibold">Account Type</th>
                    <th className="text-right py-3 px-4 font-semibold">kWh Allocated</th>
                    <th className="text-left py-3 px-4 font-semibold">Since</th>
                  </tr>
                </thead>
                <tbody>
                  {matchesData.map((match) => (
                    <tr key={match.id} className="border-b border-border hover:bg-secondary/50">
                      <td className="py-3 px-4 font-mono text-xs">{match.id}</td>
                      <td className="py-3 px-4">{match.accountType}</td>
                      <td className="text-right py-3 px-4 font-semibold">{match.kwhAllocated}</td>
                      <td className="py-3 px-4 text-muted-foreground">{match.since}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">
                No active consumers matched yet. Your energy is being stored.
              </p>
            </div>
          )}
        </div>

        {/* Free Energy Log */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Free Energy Log</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-right py-3 px-4 font-semibold">kWh</th>
                  <th className="text-left py-3 px-4 font-semibold">Reason</th>
                </tr>
              </thead>
              <tbody>
                {freeEnergyLog.map((log, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-secondary/50">
                    <td className="py-3 px-4">{log.date}</td>
                    <td className="text-right py-3 px-4 font-semibold">{log.kWh}</td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{log.reason}</Badge>
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
