import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import { Copy, Check, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const accountTypeDescriptions: Record<string, string> = {
  shoplet: 'Low-voltage commercial space',
  high_usage_home: 'Residential home with high energy consumption',
  ev_home: 'Home with electric vehicle charging',
  office: 'Small office space',
  clinic: 'Medical clinic or healthcare facility',
  cafe: 'Café or small food establishment',
  laundromat: 'Laundromat or coin-operated laundry',
};

export default function ConsumerProfile() {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const [, setLocation] = useLocation();
  const [accountType, setAccountType] = useState<string>(user?.accountType || 'high_usage_home');
  const [copied, setCopied] = useState(false);

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

  const handleCopyReferral = () => {
    const referralCode = `PWH_${user.uid?.slice(-8).toUpperCase()}`;
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success('Referral code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdateAccountType = () => {
    updateProfile({ accountType: accountType as any });
    toast.success('Account type updated successfully!');
  };

  const referralCode = `PWH_${user.uid?.slice(-8).toUpperCase()}`;

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Account Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        {/* Account Type */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Account Type</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="accountType">Current Account Type</Label>
              <div className="flex gap-2 mt-2">
                <Select value={accountType} onValueChange={setAccountType}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shoplet">Shoplet</SelectItem>
                    <SelectItem value="high_usage_home">High-Usage Home</SelectItem>
                    <SelectItem value="ev_home">EV Home</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="clinic">Clinic</SelectItem>
                    <SelectItem value="cafe">Café</SelectItem>
                    <SelectItem value="laundromat">Laundromat</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleUpdateAccountType}
                  className="bg-primary hover:bg-primary/90"
                >
                  Update
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {accountTypeDescriptions[accountType]}
              </p>
            </div>

            <div className="pt-4 border-t border-border">
              <Badge className="bg-power-blue text-white">
                {accountType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </Badge>
            </div>
          </div>
        </div>

        {/* Billing Information */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Billing Information</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Wallet Balance</p>
              <div className="flex items-center justify-between p-4 bg-power-green/10 rounded-lg">
                <p className="text-2xl font-bold text-power-green">
                  RM {user.walletBalance.toFixed(2)}
                </p>
                <Button variant="outline" size="sm">
                  Top Up
                </Button>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Active Subscription</p>
              <Badge className="bg-power-blue text-white">
                Standard Plan - 700 kWh/month
              </Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Billing Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
        </div>

        {/* TNB Linkage */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">TNB Account Linkage</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Linked TNB Account</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline">****5678</Badge>
                <Button variant="ghost" size="sm">
                  Update
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Your TNB account is linked for billing integration. This allows us to provide
                accurate savings comparisons and billing information.
              </p>
            </div>
          </div>
        </div>

        {/* Referral Program */}
        <div className="card-soft p-6 bg-gradient-to-r from-power-amber/10 to-power-green/10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-power-amber/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-power-amber" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-2">Referral Program</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Invite friends to Power Hub and earn rewards when they subscribe!
              </p>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Your Referral Code</p>
                  <div className="flex gap-2">
                    <Input
                      value={referralCode}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyReferral}
                      className="gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="pt-3 border-t border-amber-200">
                  <p className="text-sm font-medium">0 friends referred</p>
                  <p className="text-xs text-muted-foreground">
                    Earn RM 50 credit for each friend who subscribes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Account Security</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Password</p>
                <p className="text-xs text-muted-foreground">Last changed 60 days ago</p>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Not enabled</p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
