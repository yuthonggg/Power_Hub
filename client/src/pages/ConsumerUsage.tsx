import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const monthlyUsageData = [
  { month: 'Jan', solar: 280, grid: 45 },
  { month: 'Feb', solar: 320, grid: 38 },
  { month: 'Mar', solar: 380, grid: 25 },
  { month: 'Apr', solar: 420, grid: 15 },
  { month: 'May', solar: 450, grid: 10 },
  { month: 'Jun', solar: 480, grid: 8 },
  { month: 'Jul', solar: 520, grid: 5 },
  { month: 'Aug', solar: 510, grid: 6 },
  { month: 'Sep', solar: 460, grid: 12 },
  { month: 'Oct', solar: 380, grid: 20 },
  { month: 'Nov', solar: 320, grid: 35 },
  { month: 'Dec', solar: 280, grid: 45 },
];

const creditStatement = [
  { date: '2025-05-01', description: 'Daily usage', credits: 18.5, balance: 215 },
  { date: '2025-04-30', description: 'Daily usage', credits: 22.3, balance: 233.5 },
  { date: '2025-04-29', description: 'Daily usage', credits: 20.1, balance: 255.8 },
  { date: '2025-04-28', description: 'Daily usage', credits: 19.8, balance: 275.9 },
  { date: '2025-04-27', description: 'Daily usage', credits: 21.5, balance: 295.7 },
  { date: '2025-04-26', description: 'Daily usage', credits: 23.2, balance: 317.2 },
  { date: '2025-04-25', description: 'Subscription renewal', credits: 700, balance: 340.4 },
];

export default function ConsumerUsage() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedMonth, setSelectedMonth] = useState('May');

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

  const handleDownloadInvoice = () => {
    const invoiceContent = `
POWER HUB - MONTHLY INVOICE
============================

Invoice Date: May 1, 2025
Account: ${user.email}
Plan: Standard (700 kWh/month)

USAGE SUMMARY
=============
Solar Credits Used: 485 kWh
Grid Usage: 10 kWh
Total Usage: 495 kWh

BILLING DETAILS
===============
Solar Credits: 485 kWh × RM 0.44 = RM 213.40
Grid Usage: 10 kWh × RM 0.5068 = RM 5.07
Total Amount: RM 218.47

SAVINGS COMPARISON
==================
Power Hub Cost: RM 213.40
TNB Estimated: RM 250.81
Your Savings: RM 37.41

Subscription Period: April 25 - May 25, 2025
    `;
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `power-hub-invoice-${selectedMonth}.txt`;
    a.click();
  };

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Usage History</h1>
          <p className="text-muted-foreground">
            Track your energy consumption and billing history
          </p>
        </div>

        {/* Monthly Usage Chart */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Usage - Last 12 Months</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="solar"
                stroke="#1D9E75"
                strokeWidth={2}
                dot={{ fill: '#1D9E75', r: 4 }}
                name="Solar Credits Used"
              />
              <Line
                type="monotone"
                dataKey="grid"
                stroke="#9CA3AF"
                strokeWidth={2}
                dot={{ fill: '#9CA3AF', r: 4 }}
                name="Grid Usage"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Credit Statement */}
        <div className="card-soft p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Credit Statement</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Current month: {selectedMonth} 2025
              </p>
            </div>
            <div className="flex gap-2">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="January">January</SelectItem>
                  <SelectItem value="February">February</SelectItem>
                  <SelectItem value="March">March</SelectItem>
                  <SelectItem value="April">April</SelectItem>
                  <SelectItem value="May">May</SelectItem>
                  <SelectItem value="June">June</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadInvoice}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Description</th>
                  <th className="text-right py-3 px-4 font-semibold">Credits Used (kWh)</th>
                  <th className="text-right py-3 px-4 font-semibold">Balance After (kWh)</th>
                </tr>
              </thead>
              <tbody>
                {creditStatement.map((row, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-secondary/50">
                    <td className="py-3 px-4">{row.date}</td>
                    <td className="py-3 px-4">
                      <span className="font-medium">{row.description}</span>
                    </td>
                    <td className="text-right py-3 px-4">
                      {row.description === 'Subscription renewal' ? (
                        <Badge className="bg-green-100 text-green-800">+{row.credits}</Badge>
                      ) : (
                        <span className="text-red-600">-{row.credits}</span>
                      )}
                    </td>
                    <td className="text-right py-3 px-4 font-semibold">{row.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice Info */}
        <div className="card-soft p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold mb-2">Download Invoice</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Click the "Download" button above to get a detailed invoice for the selected month.
            The invoice includes your usage summary, billing details, and savings comparison.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
