import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Wallet, TrendingUp, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const monthlyEarningsData = [
  { month: 'Jan', earnings: 68 },
  { month: 'Feb', earnings: 72 },
  { month: 'Mar', earnings: 85 },
  { month: 'Apr', earnings: 91 },
  { month: 'May', earnings: 98 },
  { month: 'Jun', earnings: 105 },
  { month: 'Jul', earnings: 101 },
  { month: 'Aug', earnings: 110 },
  { month: 'Sep', earnings: 95 },
  { month: 'Oct', earnings: 88 },
  { month: 'Nov', earnings: 76 },
  { month: 'Dec', earnings: 70 },
];

const earningsHistory = [
  { date: '2025-05-01', kwh: 8.3, rate: 0.34, earnings: 2.82, type: 'Auto-sold' },
  { date: '2025-04-30', kwh: 7.1, rate: 0.34, earnings: 2.41, type: 'Auto-sold' },
  { date: '2025-04-29', kwh: 9.4, rate: 0.34, earnings: 3.20, type: 'Auto-sold' },
  { date: '2025-04-28', kwh: 6.7, rate: 0.34, earnings: 2.28, type: 'Auto-sold' },
  { date: '2025-04-27', kwh: 8.8, rate: 0.34, earnings: 2.99, type: 'Auto-sold' },
  { date: '2025-04-26', kwh: 7.5, rate: 0.34, earnings: 2.55, type: 'Auto-sold' },
  { date: '2025-04-25', kwh: 10.2, rate: 0.34, earnings: 3.47, type: 'Auto-sold' },
  { date: '2025-04-24', kwh: 6.9, rate: 0.34, earnings: 2.35, type: 'Auto-sold' },
];

const walletTransactions = [
  { date: '2025-05-01', description: 'Solar earnings credited', amount: 2.82, type: 'credit' },
  { date: '2025-04-30', description: 'Solar earnings credited', amount: 2.41, type: 'credit' },
  { date: '2025-04-29', description: 'Solar earnings credited', amount: 3.20, type: 'credit' },
  { date: '2025-04-28', description: 'Withdrawal to Maybank', amount: -100.00, type: 'debit' },
  { date: '2025-04-27', description: 'Solar earnings credited', amount: 2.99, type: 'credit' },
  { date: '2025-04-26', description: 'Solar earnings credited', amount: 2.55, type: 'credit' },
];

export default function ProsumerEarnings() {
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
    { label: 'Overview', href: '/prosumer' },
    { label: 'Earnings', href: '/prosumer/earnings' },
    { label: 'Solar Profile', href: '/prosumer/profile' },
    { label: 'Account Profile', href: '/prosumer/account' },
  ];

  const thisMonthEarnings = monthlyEarningsData[4].earnings; // May
  const lifetimeEarnings = user.totalEarningsRM || 4232.50;
  const totalExported = user.totalExportedKwh || 12450;

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Earnings</h1>
          <p className="text-muted-foreground">
            Track your solar energy earnings — all exported energy is automatically sold at 34 sen/kWh
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={TrendingUp}
            label="This Month"
            value={`RM ${thisMonthEarnings.toFixed(2)}`}
            color="green"
          />
          <StatCard
            icon={Wallet}
            label="Lifetime Earnings"
            value={`RM ${lifetimeEarnings.toFixed(2)}`}
            color="amber"
          />
          <StatCard
            label="Total kWh Exported"
            value={totalExported.toLocaleString()}
            unit="kWh"
            color="blue"
          />
          <StatCard
            icon={Zap}
            label="Platform Rate"
            value="34 sen"
            unit="/kWh"
            color="green"
          />
        </div>

        <div className="card-soft p-4 bg-power-green/5 border border-power-green/20">
          <p className="text-sm text-power-green">
            💡 All your exported solar energy is <strong>automatically sold</strong> through Power Hub at <strong>34 sen/kWh</strong>. Earnings are credited to your wallet instantly.
          </p>
        </div>

        {/* Monthly Earnings Chart */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Earnings — Last 12 Months</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyEarningsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`RM ${value.toFixed(2)}`, 'Earnings']} />
              <Bar dataKey="earnings" fill="#1D9E75" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Earnings Log */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Daily Earnings Log</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-right py-3 px-4 font-semibold">Energy Sold</th>
                  <th className="text-right py-3 px-4 font-semibold">Rate</th>
                  <th className="text-right py-3 px-8 font-semibold">Earnings</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {earningsHistory.map((entry, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-secondary/50">
                    <td className="py-3 px-4">{entry.date}</td>
                    <td className="text-right py-3 px-4 font-semibold">{entry.kwh} kWh</td>
                    <td className="text-right py-3 px-4">RM {entry.rate.toFixed(2)}/kWh</td>
                    <td className="text-right py-3 px-8 font-semibold text-power-green">RM {entry.earnings.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        ✓ {entry.type}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Wallet Transactions */}
        <div className="card-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Wallet Transactions</h2>
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-xl font-bold text-power-green text-right">RM {user.eWalletBalance.toFixed(2)}</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Description</th>
                  <th className="text-right py-3 px-4 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {walletTransactions.map((tx, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-secondary/50">
                    <td className="py-3 px-4">{tx.date}</td>
                    <td className="py-3 px-4">{tx.description}</td>
                    <td className={`text-right py-3 px-4 font-semibold ${tx.type === 'credit' ? 'text-power-green' : 'text-red-500'}`}>
                      {tx.type === 'credit' ? '+' : ''}RM {Math.abs(tx.amount).toFixed(2)}
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
