import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const rateHistory = [
  { date: '2025-04-01', type: 'Buy Rate', oldRate: 0.33, newRate: 0.34, changedBy: 'admin@powerhub.com' },
  { date: '2025-03-15', type: 'Sell Rate', oldRate: 0.43, newRate: 0.44, changedBy: 'admin@powerhub.com' },
  { date: '2025-02-01', type: 'Buy Rate', oldRate: 0.32, newRate: 0.33, changedBy: 'admin@powerhub.com' },
  { date: '2025-01-10', type: 'Sell Rate', oldRate: 0.42, newRate: 0.43, changedBy: 'admin@powerhub.com' },
];

export default function AdminPricing() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [buyRate, setBuyRate] = useState(0.34);
  const [sellRate, setSellRate] = useState(0.44);
  const [editingBuy, setEditingBuy] = useState(false);
  const [editingSell, setEditingSell] = useState(false);
  const [newBuyRate, setNewBuyRate] = useState('0.34');
  const [newSellRate, setNewSellRate] = useState('0.44');

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

  const margin = (sellRate - buyRate).toFixed(2);
  const monthlyRevenue = (45230 * (sellRate - buyRate)).toFixed(2);

  const handleSaveBuyRate = () => {
    const rate = parseFloat(newBuyRate);
    if (isNaN(rate) || rate <= 0) {
      toast.error('Invalid rate');
      return;
    }
    setBuyRate(rate);
    setEditingBuy(false);
    toast.success('Buy rate updated successfully');
  };

  const handleSaveSellRate = () => {
    const rate = parseFloat(newSellRate);
    if (isNaN(rate) || rate <= 0) {
      toast.error('Invalid rate');
      return;
    }
    setSellRate(rate);
    setEditingSell(false);
    toast.success('Sell rate updated successfully');
  };

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Pricing Control</h1>
          <p className="text-muted-foreground">
            Manage platform rates and view pricing history
          </p>
        </div>

        {/* Current Rates */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Buy Rate */}
          <div className="card-soft p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold">Buy Rate (from Prosumers)</h2>
              <Dialog open={editingBuy} onOpenChange={setEditingBuy}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Buy Rate</DialogTitle>
                    <DialogDescription>
                      Set the rate paid to prosumers per kWh
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="buyRate">New Buy Rate (sen/kWh)</Label>
                      <Input
                        id="buyRate"
                        type="number"
                        step="0.01"
                        value={newBuyRate}
                        onChange={(e) => setNewBuyRate(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <p className="text-sm">
                        <strong>Current Rate:</strong> {buyRate} sen/kWh
                      </p>
                      <p className="text-sm">
                        <strong>New Rate:</strong> {newBuyRate} sen/kWh
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ⚠️ Changing rates will affect all active prosumers on their next billing cycle.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveBuyRate}
                        className="flex-1 bg-primary hover:bg-primary/90"
                      >
                        Confirm Change
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingBuy(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Rate</p>
                <p className="text-3xl font-bold text-power-green">
                  {buyRate} sen/kWh
                </p>
              </div>
              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Prosumers earn this rate for each kWh exported to Power Hub
                </p>
              </div>
            </div>
          </div>

          {/* Sell Rate */}
          <div className="card-soft p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold">Sell Rate (to Consumers)</h2>
              <Dialog open={editingSell} onOpenChange={setEditingSell}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Sell Rate</DialogTitle>
                    <DialogDescription>
                      Set the rate charged to consumers per kWh
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="sellRate">New Sell Rate (sen/kWh)</Label>
                      <Input
                        id="sellRate"
                        type="number"
                        step="0.01"
                        value={newSellRate}
                        onChange={(e) => setNewSellRate(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm">
                        <strong>Current Rate:</strong> {sellRate} sen/kWh
                      </p>
                      <p className="text-sm">
                        <strong>New Rate:</strong> {newSellRate} sen/kWh
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ⚠️ Changing rates will affect all active consumers on their next billing cycle.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveSellRate}
                        className="flex-1 bg-primary hover:bg-primary/90"
                      >
                        Confirm Change
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingSell(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Rate</p>
                <p className="text-3xl font-bold text-power-blue">
                  {sellRate} sen/kWh
                </p>
              </div>
              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Consumers pay this rate for each kWh consumed from Power Hub
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Margin and Revenue */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-soft p-6">
            <p className="text-sm text-muted-foreground mb-2">Platform Margin</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-power-amber">{margin}</p>
              <p className="text-muted-foreground">sen/kWh</p>
            </div>
            <Badge className="mt-4 bg-power-amber text-white">
              {((parseFloat(margin) / sellRate) * 100).toFixed(1)}% margin
            </Badge>
          </div>

          <div className="card-soft p-6">
            <p className="text-sm text-muted-foreground mb-2">Monthly Projected Revenue</p>
            <p className="text-3xl font-bold text-power-green">
              RM {monthlyRevenue}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Based on current trading volume
            </p>
          </div>
        </div>

        {/* Rate History */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Rate History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Rate Type</th>
                  <th className="text-right py-3 px-4 font-semibold">Old Rate</th>
                  <th className="text-right py-3 px-4 font-semibold">New Rate</th>
                  <th className="text-left py-3 px-4 font-semibold">Changed By</th>
                </tr>
              </thead>
              <tbody>
                {rateHistory.map((entry, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-secondary/50">
                    <td className="py-3 px-4">{entry.date}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">
                        {entry.type === 'Buy Rate' ? '📥' : '📤'} {entry.type}
                      </Badge>
                    </td>
                    <td className="text-right py-3 px-4">{entry.oldRate} sen</td>
                    <td className="text-right py-3 px-4 font-semibold">
                      {entry.newRate} sen
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{entry.changedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info */}
        <div className="card-soft p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold mb-2">Pricing Information</h3>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li>• All rates are in Malaysian Ringgit (RM) per kilowatt-hour (kWh)</li>
            <li>• Changes take effect on the next billing cycle for active subscriptions</li>
            <li>• The platform margin covers operational costs and platform maintenance</li>
            <li>• Rate changes are logged for audit purposes</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
