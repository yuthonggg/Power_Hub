import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { Sun, Zap, Leaf, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ProsumerProfile() {
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

  const thisMonthGeneration = 1240;
  const expectedGeneration = 1320;
  const efficiency = ((thisMonthGeneration / expectedGeneration) * 100).toFixed(1);
  const co2Offset = (user.totalExportedKwh! * 0.585).toFixed(0);

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Solar Profile</h1>
          <p className="text-muted-foreground">
            Your solar system information and performance metrics
          </p>
        </div>

        {/* Panel Information */}
        <div className="card-soft p-6">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-lg font-semibold">Panel Information</h2>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Solar Capacity</p>
                <p className="text-2xl font-bold text-power-green">
                  {user.solarCapacityKwp} kWp
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Panel Count</p>
                <p className="text-2xl font-bold">{user.panelCount}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Installation Date</p>
                <p className="text-lg font-semibold">{user.installationDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Postcode</p>
                <p className="text-lg font-semibold">{user.postcode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-6">Performance</h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-4 bg-power-green/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-power-green" />
                <p className="text-sm text-muted-foreground">This Month</p>
              </div>
              <p className="text-2xl font-bold text-power-green">{thisMonthGeneration} kWh</p>
            </div>

            <div className="p-4 bg-power-amber/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="w-5 h-5 text-power-amber" />
                <p className="text-sm text-muted-foreground">Expected</p>
              </div>
              <p className="text-2xl font-bold text-power-amber">{expectedGeneration} kWh</p>
            </div>

            <div className="p-4 bg-power-blue/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-power-blue" />
                <p className="text-sm text-muted-foreground">Efficiency</p>
              </div>
              <p className="text-2xl font-bold text-power-blue">{efficiency}%</p>
            </div>

            <div className="p-4 bg-power-green/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-5 h-5 text-power-green" />
                <p className="text-sm text-muted-foreground">CO₂ Offset</p>
              </div>
              <p className="text-2xl font-bold text-power-green">{co2Offset} kg</p>
              <p className="text-xs text-muted-foreground mt-2">
                Equivalent to {Math.round(parseInt(co2Offset) / 21)} trees
              </p>
            </div>
          </div>
        </div>

        {/* TNB Linkage */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">TNB Linkage</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Connected TNB Account</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline">****5678</Badge>
                <Button variant="ghost" size="sm">
                  Update
                </Button>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Last Sync</p>
              <p className="text-sm">Simulated — 5 minutes ago</p>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Your TNB account is linked for real-time monitoring and billing integration.
                Updates sync automatically every 15 minutes.
              </p>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">System Health</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded-full" />
                <span className="text-sm font-medium">All Systems Operational</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                ✓ Good
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full" />
                <span className="text-sm font-medium">Last Maintenance</span>
              </div>
              <span className="text-sm text-muted-foreground">2025-04-10</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-600 rounded-full" />
                <span className="text-sm font-medium">Next Scheduled Maintenance</span>
              </div>
              <span className="text-sm text-muted-foreground">2025-07-10</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
