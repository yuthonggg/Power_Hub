import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { DEMO_ACCOUNTS } from '@/lib/demoAccounts';
import { Sun, Zap, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DemoSelector() {
  const { register } = useAuth();
  const [, setLocation] = useLocation();

  const demoRoles = [
    {
      role: 'prosumer',
      title: 'Prosumer Demo',
      description: 'Solar panel owner earning from energy exports',
      icon: Sun,
      color: 'from-power-green to-power-amber',
      redirectTo: '/prosumer',
    },
    {
      role: 'consumer',
      title: 'Consumer Demo',
      description: 'Energy subscriber saving on electricity bills',
      icon: Zap,
      color: 'from-power-blue to-power-green',
      redirectTo: '/consumer',
    },
    {
      role: 'admin',
      title: 'Admin Demo',
      description: 'Platform operator managing rates and inventory',
      icon: Settings,
      color: 'from-power-purple to-power-amber',
      redirectTo: '/admin',
    },
  ];

  const handleDemoLogin = async (role: 'prosumer' | 'consumer' | 'admin') => {
    const demoAccount = DEMO_ACCOUNTS[role];
    try {
      await register(demoAccount.email, 'demo_password_123', demoAccount);
      const redirect = demoRoles.find(r => r.role === role)?.redirectTo;
      if (redirect) {
        setLocation(redirect);
      }
    } catch (error) {
      console.error('Demo login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-power-green to-power-amber rounded-lg flex items-center justify-center">
              <Sun className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold" style={{ fontFamily: 'Geist, sans-serif' }}>
              Power Hub
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Demo Mode</p>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>
              Choose Your Demo Role
            </h1>
            <p className="text-xl text-muted-foreground">
              Instantly access any role to explore Power Hub features
            </p>
          </div>

          {/* Demo Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {demoRoles.map((demo) => {
              const Icon = demo.icon;
              return (
                <div
                  key={demo.role}
                  className={`card-soft p-8 bg-gradient-to-br ${demo.color} bg-opacity-5 border-2 border-opacity-20 hover:shadow-lg transition-all`}
                >
                  <div className="mb-6">
                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${demo.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{demo.title}</h2>
                    <p className="text-muted-foreground">{demo.description}</p>
                  </div>

                  <div className="space-y-3 mb-6 p-4 bg-white rounded-lg border border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-mono text-sm">{DEMO_ACCOUNTS[demo.role as keyof typeof DEMO_ACCOUNTS].email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Password</p>
                      <p className="font-mono text-sm">demo_password_123</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleDemoLogin(demo.role as any)}
                    className={`w-full bg-gradient-to-r ${demo.color} text-white hover:opacity-90 font-semibold`}
                  >
                    Enter as {demo.title.split(' ')[0]}
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Info Section */}
          <div className="mt-16 card-soft p-8 bg-blue-50 border-blue-200">
            <h3 className="text-lg font-semibold mb-4">Demo Mode Information</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ All data is simulated and resets on page refresh</li>
              <li>✓ No backend required - everything runs in your browser</li>
              <li>✓ Energy data updates every 30 seconds</li>
              <li>✓ Switch roles anytime by returning to this page</li>
              <li>✓ Perfect for testing and exploring all features</li>
            </ul>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>
              Want to use real credentials?{' '}
              <a href="/login" className="text-primary font-semibold hover:underline">
                Go to Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
