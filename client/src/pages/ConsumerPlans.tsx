import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import { Zap, Check } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const plans = [
  {
    name: 'Starter',
    kwhPerMonth: 300,
    monthlyRate: 132,
    ratePerKwh: 0.44,
    bestFor: 'Small office / café',
    features: [
      'Up to 300 kWh/month',
      'Real-time monitoring',
      'Monthly billing',
      'Email support',
    ],
    availability: 'Available',
  },
  {
    name: 'Standard',
    kwhPerMonth: 700,
    monthlyRate: 308,
    ratePerKwh: 0.44,
    bestFor: 'Shoplet / home',
    features: [
      'Up to 700 kWh/month',
      'Real-time monitoring',
      'Monthly billing',
      'Priority support',
      'Usage analytics',
    ],
    availability: 'Available',
    recommended: true,
  },
  {
    name: 'Premium',
    kwhPerMonth: 1500,
    monthlyRate: 660,
    ratePerKwh: 0.44,
    bestFor: 'High-usage / EV',
    features: [
      'Up to 1,500 kWh/month',
      'Real-time monitoring',
      'Monthly billing',
      '24/7 support',
      'Advanced analytics',
      'Priority allocation',
    ],
    availability: 'Available',
  },
];

export default function ConsumerPlans() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [savingsUsage, setSavingsUsage] = useState(800);
  const [subscribeDialogOpen, setSubscribeDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

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

  const savings = (savingsUsage * (0.5068 - 0.44)).toFixed(2);
  const recommendedPlan = plans.find(p => p.kwhPerMonth >= user.avgMonthlyUsageKwh!);

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Subscription Plans</h1>
          <p className="text-muted-foreground">
            Choose the perfect plan for your energy needs
          </p>
        </div>

        {/* Savings Calculator */}
        <div className="card-soft p-6 bg-gradient-to-r from-power-green/10 to-power-blue/10">
          <h2 className="text-lg font-semibold mb-4">Savings Calculator</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="usage">My average monthly usage (kWh)</Label>
              <Input
                id="usage"
                type="number"
                value={savingsUsage}
                onChange={(e) => setSavingsUsage(parseFloat(e.target.value) || 0)}
                className="mt-2"
              />
            </div>
            <div className="p-4 bg-white rounded-lg border border-power-green/20">
              <p className="text-sm text-muted-foreground mb-2">You'd save approximately</p>
              <p className="text-3xl font-bold text-power-green">
                RM {savings}
              </p>
              <p className="text-xs text-muted-foreground mt-2">per month with Power Hub</p>
            </div>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card-soft p-6 relative transition-all ${
                plan.recommended ? 'ring-2 ring-power-green shadow-lg' : ''
              }`}
            >
              {plan.recommended && (
                <Badge className="absolute -top-3 left-6 bg-power-green">
                  Recommended
                </Badge>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.bestFor}</p>
              </div>

              <div className="mb-6 pb-6 border-b border-border">
                <p className="text-sm text-muted-foreground mb-1">Monthly cost</p>
                <p className="text-3xl font-bold text-power-green">
                  RM {plan.monthlyRate}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {plan.kwhPerMonth} kWh/month at {(plan.ratePerKwh * 100).toFixed(0)} sen/kWh
                </p>
              </div>

              <div className="mb-6 space-y-2">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-power-green flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <Badge variant="outline">{plan.availability}</Badge>
              </div>

              <Dialog open={subscribeDialogOpen && selectedPlan === plan.name} onOpenChange={(open) => {
                if (open) {
                  setSelectedPlan(plan.name);
                  setSubscribeDialogOpen(true);
                } else {
                  setSubscribeDialogOpen(false);
                }
              }}>
                <DialogTrigger asChild>
                  <Button
                    className={`w-full ${
                      plan.recommended
                        ? 'bg-power-green hover:bg-power-green/90'
                        : 'bg-primary hover:bg-primary/90'
                    }`}
                  >
                    Subscribe Now
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Subscribe to {plan.name} Plan</DialogTitle>
                    <DialogDescription>
                      Complete your subscription setup
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Plan Details</Label>
                      <div className="mt-2 p-3 bg-secondary rounded-lg">
                        <p className="font-semibold">{plan.name} Plan</p>
                        <p className="text-sm text-muted-foreground">
                          {plan.kwhPerMonth} kWh/month
                        </p>
                        <p className="text-lg font-bold text-power-green mt-1">
                          RM {plan.monthlyRate}/month
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="billing">Billing Cycle</Label>
                      <Select defaultValue="monthly">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly (RM {plan.monthlyRate})</SelectItem>
                          <SelectItem value="quarterly">
                            Quarterly (RM {(plan.monthlyRate * 3 * 0.95).toFixed(2)} - 5% off)
                          </SelectItem>
                          <SelectItem value="annual">
                            Annual (RM {(plan.monthlyRate * 12 * 0.9).toFixed(2)} - 10% off)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm">
                        <strong>Wallet Balance:</strong> RM {user.eWalletBalance.toFixed(2)}
                      </p>
                    </div>

                    <Button className="w-full bg-power-green hover:bg-power-green/90">
                      Confirm & Subscribe
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Plan Information</h2>
          <div className="space-y-3 text-sm">
            <p>
              <strong>Rate:</strong> All plans are charged at <strong>44 sen/kWh</strong>, which is significantly cheaper than TNB's average rate of 50–54 sen/kWh.
            </p>
            <p>
              <strong>Billing:</strong> Subscriptions renew automatically on your billing date. You can upgrade, downgrade, or cancel anytime.
            </p>
            <p>
              <strong>Rollover:</strong> Unused credits do not roll over to the next month. Plan your usage accordingly.
            </p>
            <p>
              <strong>Support:</strong> Contact our support team for any questions about your plan or usage.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
