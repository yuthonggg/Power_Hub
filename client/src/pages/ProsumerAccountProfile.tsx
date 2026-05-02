import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import { Copy, Check, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function ProsumerAccountProfile() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
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
    { label: 'Overview', href: '/prosumer' },
    { label: 'Earnings', href: '/prosumer/earnings' },
    { label: 'Solar Profile', href: '/prosumer/profile' },
    { label: 'Account Profile', href: '/prosumer/account' },
  ];

  const handleCopyReferral = () => {
    const referralCode = `PWH_${user.uid?.slice(-8).toUpperCase()}`;
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success('Referral code copied!');
    setTimeout(() => setCopied(false), 2000);
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

        {/* Billing Information */}
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold mb-4">Billing Information</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Wallet Balance</p>
              <div className="flex items-center justify-between p-4 bg-power-green/10 rounded-lg">
                <p className="text-2xl font-bold text-power-green">
                  RM {user.eWalletBalance.toFixed(2)}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Deposit
                  </Button>
                  <Button variant="outline" size="sm">
                    Withdraw
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Billing Email</p>
              <p className="font-medium">{user.email}</p>
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
                Invite friends to Power Hub and earn rewards when they join!
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
