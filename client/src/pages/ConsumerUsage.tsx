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
  { month: 'Jan', solar: 100, tnb: 720 },
  { month: 'Feb', solar: 100, tnb: 680 },
  { month: 'Mar', solar: 280, tnb: 550 },
  { month: 'Apr', solar: 300, tnb: 520 },
  { month: 'May', solar: 300, tnb: 550 },
  { month: 'Jun', solar: 300, tnb: 580 },
  { month: 'Jul', solar: 300, tnb: 600 },
  { month: 'Aug', solar: 300, tnb: 570 },
  { month: 'Sep', solar: 300, tnb: 540 },
  { month: 'Oct', solar: 300, tnb: 500 },
  { month: 'Nov', solar: 300, tnb: 480 },
  { month: 'Dec', solar: 300, tnb: 520 },
];

const billingHistory = [
  {
    month: 'May 2025',
    totalUsage: 850,
    solarAllocation: 300,
    tnbUsage: 550,
    solarCost: 132.00,
    tnbCost: 278.74,
    totalCost: 410.74,
    savings: 19.78,
    status: 'Paid',
  },
  {
    month: 'Apr 2025',
    totalUsage: 820,
    solarAllocation: 300,
    tnbUsage: 520,
    solarCost: 132.00,
    tnbCost: 263.54,
    totalCost: 395.54,
    savings: 20.04,
    status: 'Paid',
  },
  {
    month: 'Mar 2025',
    totalUsage: 830,
    solarAllocation: 280,
    tnbUsage: 550,
    solarCost: 123.20,
    tnbCost: 278.74,
    totalCost: 401.94,
    savings: 18.65,
    status: 'Paid',
  },
  {
    month: 'Feb 2025',
    totalUsage: 780,
    solarAllocation: 100,
    tnbUsage: 680,
    solarCost: 44.00,
    tnbCost: 344.62,
    totalCost: 388.62,
    savings: 6.68,
    status: 'Paid',
  },
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
    { label: 'Plans', href: '/consumer/plans' },
    { label: 'Billing', href: '/consumer/usage' },
    { label: 'Profile', href: '/consumer/profile' },
  ];

  const tnbRate = user.accountType === 'shoplet' || user.accountType === 'cafe' || user.accountType === 'laundromat' || user.accountType === 'office' || user.accountType === 'clinic'
    ? 50.68
    : 54.43;

  const handleDownloadInvoice = () => {
    const currentBill = billingHistory[0];
    const invoiceContent = `
POWER HUB - MONTHLY INVOICE (SPLIT BILLING)
=============================================

Invoice Date: ${currentBill.month}
Account: ${user.email}
Plan: ${user.activeSubscriptionPlan || 'Plus'} (${user.activeSubscriptionPlan === 'Pro' ? 500 : user.activeSubscriptionPlan === 'Standard' ? 100 : 300} kWh/month)

USAGE SUMMARY
=============
Total Electricity Used:     ${currentBill.totalUsage} kWh
Solar Allocation (Power Hub): -${currentBill.solarAllocation} kWh
Remaining Grid Usage (TNB):   ${currentBill.tnbUsage} kWh

BILLING DETAILS — SPLIT BILL
=============================
1. POWER HUB PORTION
   Solar Credits: ${currentBill.solarAllocation} kWh × RM 0.44 = RM ${currentBill.solarCost.toFixed(2)}
   Paid from: e-Wallet

2. TNB PORTION
   Grid Usage: ${currentBill.tnbUsage} kWh × RM ${(tnbRate / 100).toFixed(4)} = RM ${currentBill.tnbCost.toFixed(2)}
   Paid via: TNB integrated payment

TOTAL AMOUNT: RM ${currentBill.totalCost.toFixed(2)}

SAVINGS COMPARISON
==================
If fully on TNB: RM ${(currentBill.totalUsage * tnbRate / 100).toFixed(2)}
With Power Hub:  RM ${currentBill.totalCost.toFixed(2)}
Your Savings:    RM ${currentBill.savings.toFixed(2)}

Note: Power Hub portion is deducted from your e-wallet.
TNB portion is processed through integrated TNB payment gateway.
    `;
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `power-hub-invoice-${selectedMonth}-2025.txt`;
    a.click();
  };

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Billing & Usage History</h1>
          <p className="text-muted-foreground">
            Track your electricity consumption and split billing between Power Hub & TNB
          </p>
        </div>

        {/* Monthly Usage Chart */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Usage Breakdown — Solar vs TNB Grid</h2>
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
                name="Solar (Power Hub)"
              />
              <Line
                type="monotone"
                dataKey="tnb"
                stroke="#9CA3AF"
                strokeWidth={2}
                dot={{ fill: '#9CA3AF', r: 4 }}
                name="Grid (TNB)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Billing History */}
        <div className="card-soft p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Billing History — Split Bills</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Each bill shows Power Hub and TNB portions separately
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
                Invoice
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Month</th>
                  <th className="text-right py-3 px-4 font-semibold">Total Usage</th>
                  <th className="text-right py-3 px-4 font-semibold text-power-green">Power Hub</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-500">TNB</th>
                  <th className="text-right py-3 px-4 font-semibold">Total Bill</th>
                  <th className="text-right py-3 px-4 font-semibold text-power-green">Saved</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((bill, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-secondary/50">
                    <td className="py-3 px-4 font-medium">{bill.month}</td>
                    <td className="text-right py-3 px-4">{bill.totalUsage} kWh</td>
                    <td className="text-right py-3 px-4">
                      <div>
                        <span className="font-semibold text-power-green">RM {bill.solarCost.toFixed(2)}</span>
                        <p className="text-xs text-muted-foreground">{bill.solarAllocation} kWh</p>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4">
                      <div>
                        <span className="font-semibold text-gray-600">RM {bill.tnbCost.toFixed(2)}</span>
                        <p className="text-xs text-muted-foreground">{bill.tnbUsage} kWh</p>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 font-bold">RM {bill.totalCost.toFixed(2)}</td>
                    <td className="text-right py-3 px-4 font-semibold text-power-green">RM {bill.savings.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        ✓ {bill.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How Split Billing Works */}
        <div className="card-soft p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold mb-3">How Split Billing Works</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>1. Total usage is measured</strong> — Your smart meter records total electricity consumed during the month.
            </p>
            <p>
              <strong>2. Solar allocation is deducted</strong> — Up to your plan's kWh limit is allocated from the community solar pool.
            </p>
            <p>
              <strong>3. Power Hub charges the solar portion</strong> — Deducted from your e-wallet at 44 sen/kWh.
            </p>
            <p>
              <strong>4. TNB charges the grid portion</strong> — Remaining usage billed at standard TNB rate (~{tnbRate.toFixed(2)} sen/kWh).
            </p>
            <p>
              <strong>5. One convenient payment</strong> — Both portions are handled through the app. Power Hub deducts from your wallet, TNB payment is processed through integrated payment gateway.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
