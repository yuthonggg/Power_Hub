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

const plans = [
  {
    name: 'Standard',
    kwhPerMonth: 100,
    ratePerKwh: 0.44,
    bestFor: 'Small shoplots or high-usage homes wanting a basic clean energy plan',
    features: [
      'Up to 100 kWh/month solar credits',
      'Real-time usage monitoring',
      'Monthly billing via e-wallet',
      'Email support',
    ],
    availability: 'Available',
  },
  {
    name: 'Plus',
    kwhPerMonth: 300,
    ratePerKwh: 0.44,
    bestFor: 'Medium shoplots, EV homes, cafés, clinics, or offices',
    features: [
      'Up to 300 kWh/month solar credits',
      'Real-time usage monitoring',
      'Monthly billing via e-wallet',
      'Priority support',
      'Usage analytics',
    ],
    availability: 'Available',
    recommended: true,
  },
  {
    name: 'Pro',
    kwhPerMonth: 500,
    ratePerKwh: 0.44,
    bestFor: 'Larger shoplots, laundromats, high-usage homes, or heavier users',
    features: [
      'Up to 500 kWh/month solar credits',
      'Real-time usage monitoring',
      'Monthly billing via e-wallet',
      '24/7 priority support',
      'Advanced analytics',
      'Priority allocation from solar pool',
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
    { label: 'Plans', href: '/consumer/plans' },
    { label: 'Billing', href: '/consumer/usage' },
    { label: 'Profile', href: '/consumer/profile' },
  ];

  // Calculate savings: TNB rate (~50.68 sen for shoplots) vs Power Hub (44 sen)
  const tnbRate = user.accountType === 'shoplet' || user.accountType === 'cafe' || user.accountType === 'laundromat' || user.accountType === 'office' || user.accountType === 'clinic'
    ? 0.5068
    : 0.5443; // high-usage domestic
  const savingsPerKwh = tnbRate - 0.44;
  const savings = (savingsUsage * savingsPerKwh).toFixed(2);

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Subscription Plans</h1>
          <p className="text-muted-foreground">
            Choose your monthly solar credit package — rate adjusted monthly based on supply & demand
          </p>
        </div>

        {/* Current Rate Info */}
        <div className="card-soft p-4 bg-power-green/5 border border-power-green/20">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm">
              <strong>Current Rate:</strong> <span className="text-power-green font-bold">44 sen/kWh</span> — adjusted monthly (range: 42–46 sen/kWh)
            </p>
            <Badge variant="outline" className="border-power-green text-power-green">
              Community Solar
            </Badge>
          </div>
        </div>

        {/* Bill Estimator */}
        <div className="card-soft p-6 bg-gradient-to-r from-power-green/10 to-power-blue/10">
          <h2 className="text-lg font-semibold mb-4">Platform Bill Estimator</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="usage">My desired solar allocation (kWh)</Label>
              <Input
                id="usage"
                type="number"
                value={savingsUsage}
                onChange={(e) => setSavingsUsage(parseFloat(e.target.value) || 0)}
                className="mt-2"
              />
            </div>
            <div className="p-4 bg-white rounded-lg border border-power-green/20">
              <p className="text-sm text-muted-foreground mb-2">Estimated Platform Cost</p>
              <p className="text-3xl font-bold text-power-green">
                RM {(savingsUsage * 0.44).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                per month at current rate
              </p>
            </div>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const monthlyCost = (plan.kwhPerMonth * plan.ratePerKwh).toFixed(0);
            return (
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
                  <p className="text-sm text-muted-foreground mb-1">Monthly allocation</p>
                  <p className="text-3xl font-bold text-power-green">
                    {plan.kwhPerMonth} kWh
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ≈ RM {monthlyCost}/month at {(plan.ratePerKwh * 100).toFixed(0)} sen/kWh
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
                      <DialogTitle>Subscribe to {plan.name}</DialogTitle>
                      <DialogDescription>
                        Monthly solar credit subscription — billed from your e-wallet
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Plan Details</Label>
                        <div className="mt-2 p-3 bg-secondary rounded-lg">
                          <p className="font-semibold">{plan.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {plan.kwhPerMonth} kWh/month
                          </p>
                          <p className="text-lg font-bold text-power-green mt-1">
                            ≈ RM {monthlyCost}/month
                          </p>
                        </div>
                      </div>

                      <div className="p-3 bg-blue-50 rounded-lg space-y-1">
                        <p className="text-sm">
                          <strong>How billing works:</strong>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          At the end of each month, your total electricity usage is measured. Up to {plan.kwhPerMonth} kWh is charged at our rate (44 sen/kWh) from your wallet. Any usage above {plan.kwhPerMonth} kWh is charged by TNB at their normal rate.
                        </p>
                      </div>

                      <div className="p-3 bg-green-50 rounded-lg">
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
            );
          })}
        </div>

        {/* Plan Information */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">How It Works</h2>
          <div className="space-y-3 text-sm">
            <p>
              <strong>Rate:</strong> All plans are charged at <strong>44 sen/kWh</strong> (adjusted monthly between 42–46 sen/kWh based on supply & demand).
            </p>
            <p>
              <strong>Billing:</strong> At month-end, your total usage is measured. The platform allocates up to your plan's kWh limit from community solar energy. You pay Power Hub for the allocated solar portion, and TNB for the remaining grid portion.
            </p>
            <p>
              <strong>Payment:</strong> All payments are processed through your Power Hub e-wallet. Keep your wallet topped up to ensure seamless billing.
            </p>
            <p>
              <strong>Energy Pool:</strong> Subscriptions are limited by the total solar energy available from participating prosumers. If the pool is fully subscribed, new subscribers may need to wait.
            </p>
            <p>
              <strong>Rollover:</strong> Unused credits do not roll over to the next month.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
