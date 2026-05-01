import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth, type UserRole } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { useState } from 'react';
import { Sun } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';

export default function Register() {
  const [role, setRole] = useState<UserRole>('prosumer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const [, setLocation] = useLocation();

  // Prosumer fields
  const [solarCapacity, setSolarCapacity] = useState('');
  const [panelCount, setPanelCount] = useState('');
  const [postcode, setPostcode] = useState('');

  // Consumer fields
  const [accountType, setAccountType] = useState('high_usage_home');
  const [avgUsage, setAvgUsage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (role === 'prosumer' && (!solarCapacity || !panelCount)) {
      toast.error('Please fill in all prosumer details');
      return;
    }

    if (role === 'consumer' && !avgUsage) {
      toast.error('Please fill in consumer details');
      return;
    }

    setLoading(true);
    try {
      const profileData: any = {
        name,
        email,
        role,
      };

      if (role === 'prosumer') {
        profileData.solarCapacityKwp = parseFloat(solarCapacity);
        profileData.panelCount = parseInt(panelCount);
        profileData.postcode = postcode;
        profileData.isCapped = false;
        profileData.totalExportedKwh = 0;
        profileData.totalEarningsRM = 0;
      } else if (role === 'consumer') {
        profileData.accountType = accountType;
        profileData.avgMonthlyUsageKwh = parseFloat(avgUsage);
        profileData.activeSubscriptionId = null;
      }

      await register(email, password, profileData);
      toast.success('Registration successful!');
      setLocation(role === 'prosumer' ? '/prosumer' : '/consumer');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-power-green to-power-amber rounded-lg flex items-center justify-center">
                <Sun className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Join Power Hub</h1>
            <p className="text-muted-foreground">
              Choose your role to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selector */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              <button
                type="button"
                onClick={() => setRole('prosumer')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  role === 'prosumer'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <p className="font-semibold text-sm">Prosumer</p>
                <p className="text-xs text-muted-foreground">Solar Owner</p>
              </button>
              <button
                type="button"
                onClick={() => setRole('consumer')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  role === 'consumer'
                    ? 'border-power-blue bg-power-blue/10'
                    : 'border-border hover:border-power-blue/50'
                }`}
              >
                <p className="font-semibold text-sm">Consumer</p>
                <p className="text-xs text-muted-foreground">Energy Buyer</p>
              </button>
            </div>

            {/* Common fields */}
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Prosumer-specific fields */}
            {role === 'prosumer' && (
              <>
                <div>
                  <Label htmlFor="solarCapacity">Solar Capacity (kWp)</Label>
                  <Input
                    id="solarCapacity"
                    type="number"
                    step="0.1"
                    placeholder="5.5"
                    value={solarCapacity}
                    onChange={(e) => setSolarCapacity(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="panelCount">Panel Count</Label>
                  <Input
                    id="panelCount"
                    type="number"
                    placeholder="16"
                    value={panelCount}
                    onChange={(e) => setPanelCount(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input
                    id="postcode"
                    placeholder="50000"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </>
            )}

            {/* Consumer-specific fields */}
            {role === 'consumer' && (
              <>
                <div>
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select value={accountType} onValueChange={setAccountType}>
                    <SelectTrigger>
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
                </div>

                <div>
                  <Label htmlFor="avgUsage">Average Monthly Usage (kWh)</Label>
                  <Input
                    id="avgUsage"
                    type="number"
                    placeholder="800"
                    value={avgUsage}
                    onChange={(e) => setAvgUsage(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <a href="/login" className="text-primary font-semibold hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
