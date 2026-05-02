import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Lock, Unlock } from 'lucide-react';

const prosumerData = [
  {
    id: 'P001',
    name: 'Ahmad Hassan',
    email: 'ahmad@example.com',
    capacity: 5.5,
    totalExported: 12450,
    totalEarnings: 4232.50,
    capStatus: 'Active',
  },
  {
    id: 'P002',
    name: 'Siti Nur',
    email: 'siti@example.com',
    capacity: 8.2,
    totalExported: 18920,
    totalEarnings: 6432.80,
    capStatus: 'Capped',
  },
  {
    id: 'P003',
    name: 'Raj Kumar',
    email: 'raj@example.com',
    capacity: 6.0,
    totalExported: 15230,
    totalEarnings: 5178.20,
    capStatus: 'Active',
  },
];

const consumerData = [
  {
    id: 'C001',
    name: 'Lim Hock',
    email: 'lim@example.com',
    accountType: 'High-usage Home',
    activePlan: 'Standard',
    creditsUsed: 485,
    walletBalance: 250.50,
  },
  {
    id: 'C002',
    name: 'Fatimah Zahra',
    email: 'fatimah@example.com',
    accountType: 'Shoplet',
    activePlan: 'Starter',
    creditsUsed: 280,
    walletBalance: 125.75,
  },
  {
    id: 'C003',
    name: 'David Chen',
    email: 'david@example.com',
    accountType: 'Office',
    activePlan: 'Premium',
    creditsUsed: 1420,
    walletBalance: 500.00,
  },
];

export default function AdminUsers() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('prosumers');

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
    { label: 'Inventory Management', href: '/admin/inventory' },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">
            Manage prosumers, consumers, and their accounts
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="prosumers">
              Prosumers ({prosumerData.length})
            </TabsTrigger>
            <TabsTrigger value="consumers">
              Consumers ({consumerData.length})
            </TabsTrigger>
          </TabsList>

          {/* Prosumers Tab */}
          <TabsContent value="prosumers" className="space-y-4">
            <div className="card-soft p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Name</th>
                      <th className="text-left py-3 px-4 font-semibold">Email</th>
                      <th className="text-right py-3 px-4 font-semibold">Capacity (kWp)</th>
                      <th className="text-right py-3 px-4 font-semibold">Total Exported</th>
                      <th className="text-right py-3 px-4 font-semibold">Earnings</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prosumerData.map((prosumer) => (
                      <tr key={prosumer.id} className="border-b border-border hover:bg-secondary/50">
                        <td className="py-3 px-4 font-medium">{prosumer.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{prosumer.email}</td>
                        <td className="text-right py-3 px-4">{prosumer.capacity}</td>
                        <td className="text-right py-3 px-4">{prosumer.totalExported} kWh</td>
                        <td className="text-right py-3 px-4 font-semibold">
                          RM {prosumer.totalEarnings.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            className={
                              prosumer.capStatus === 'Active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }
                          >
                            {prosumer.capStatus === 'Active' ? '✓' : '⊘'} {prosumer.capStatus}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={
                                prosumer.capStatus === 'Capped'
                                  ? 'text-green-600'
                                  : 'text-amber-600'
                              }
                            >
                              {prosumer.capStatus === 'Capped' ? (
                                <Unlock className="w-4 h-4" />
                              ) : (
                                <Lock className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Consumers Tab */}
          <TabsContent value="consumers" className="space-y-4">
            <div className="card-soft p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Name</th>
                      <th className="text-left py-3 px-4 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 font-semibold">Account Type</th>
                      <th className="text-left py-3 px-4 font-semibold">Active Plan</th>
                      <th className="text-right py-3 px-4 font-semibold">Credits Used</th>
                      <th className="text-right py-3 px-4 font-semibold">Wallet</th>
                      <th className="text-left py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consumerData.map((consumer) => (
                      <tr key={consumer.id} className="border-b border-border hover:bg-secondary/50">
                        <td className="py-3 px-4 font-medium">{consumer.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{consumer.email}</td>
                        <td className="py-3 px-4">{consumer.accountType}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{consumer.activePlan}</Badge>
                        </td>
                        <td className="text-right py-3 px-4">{consumer.creditsUsed} kWh</td>
                        <td className="text-right py-3 px-4 font-semibold">
                          RM {consumer.walletBalance.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              ✕
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
