import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import { Sun, Zap, TrendingUp, Leaf, Users, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

function CountUpNumber({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count.toLocaleString()}</span>;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Your rooftop solar.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-power-green to-power-amber">
                  Your community's power.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Malaysia's first neighbourhood solar subscription platform. Earn more from your solar panels. Pay less for clean energy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register?role=prosumer">
                  <Button className="bg-primary hover:bg-primary/90 text-lg h-12 px-8">
                    Join as Prosumer
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/register?role=consumer">
                  <Button variant="outline" className="text-lg h-12 px-8">
                    Subscribe as Consumer
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative h-96 bg-gradient-to-br from-power-green/10 to-power-amber/10 rounded-2xl flex items-center justify-center">
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-power-green/5 via-transparent to-power-amber/5" />
              </div>
              <div className="relative text-center">
                <Sun className="w-24 h-24 text-power-green mx-auto mb-4 animate-pulse" />
                <p className="text-2xl font-bold text-power-green">
                  Real-time Energy Trading
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-16 pt-12 border-t border-border">
          <div className="container">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-3xl font-bold text-power-green">
                  <CountUpNumber target={45230} />
                </p>
                <p className="text-sm text-muted-foreground mt-2">kWh Traded</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-power-amber">
                  <CountUpNumber target={1240} />
                </p>
                <p className="text-sm text-muted-foreground mt-2">Active Users</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-power-blue">
                  <CountUpNumber target={26400} />
                </p>
                <p className="text-sm text-muted-foreground mt-2">kg CO₂ Saved</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to connect renewable energy with your community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Sun,
                title: 'Generate',
                description: 'Solar panels produce energy. Excess is exported to Power Hub.',
                color: 'green',
              },
              {
                icon: Zap,
                title: 'Subscribe',
                description: 'Consumers subscribe to monthly solar credit packages.',
                color: 'amber',
              },
              {
                icon: TrendingUp,
                title: 'Save',
                description: 'Pay a competitive 44 sen/kWh rate. Everyone wins.',
                color: 'blue',
              },
            ].map((step, idx) => {
              const Icon = step.icon;
              const colorMap = {
                green: { bg: '#E1F5EE', text: '#1D9E75' },
                amber: { bg: '#FAEEDA', text: '#EF9F27' },
                blue: { bg: '#E6F1FB', text: '#378ADD' },
              };
              const { bg, text } = colorMap[step.color as keyof typeof colorMap];

              return (
                <div key={idx} className="card-soft p-8">
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: bg }}
                  >
                    <Icon className="w-7 h-7" style={{ color: text }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Better Rates for Everyone</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Power Hub creates a win-win for both prosumers and consumers
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Prosumer Card */}
            <div className="card-soft p-8 border-2 border-power-green/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-power-green/10 rounded-lg flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-power-green" />
                </div>
                <h3 className="text-2xl font-bold">Prosumers</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Earn per kWh exported</p>
                  <p className="text-3xl font-bold text-power-green">34 sen</p>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">vs Traditional Export</p>
                  <p className="text-lg font-semibold text-green-600">Higher returns</p>
                </div>
              </div>
            </div>

            {/* Consumer Card */}
            <div className="card-soft p-8 border-2 border-power-blue/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-power-blue/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-power-blue" />
                </div>
                <h3 className="text-2xl font-bold">Consumers</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Pay per kWh consumed</p>
                  <p className="text-3xl font-bold text-power-blue">44 sen</p>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Integrated Billing</p>
                  <p className="text-lg font-semibold text-blue-600">Seamless split-bill experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Users */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Perfect For</h2>
            <p className="text-lg text-muted-foreground">
              Power Hub serves a diverse range of energy consumers
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Low-voltage Shoplots',
              'High-usage Homes',
              'EV-heavy Homes',
              'Small Offices',
              'Clinics',
              'Cafés',
              'Laundromats',
              'And More',
            ].map((type, idx) => (
              <div
                key={idx}
                className="card-soft p-6 text-center hover:shadow-md transition-shadow"
              >
                <Users className="w-8 h-8 text-power-green mx-auto mb-3" />
                <p className="font-medium">{type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-power-green/10 to-power-amber/10">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join the Energy Revolution?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start trading clean energy with your community today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=prosumer">
              <Button className="bg-primary hover:bg-primary/90 text-lg h-12 px-8">
                Get Started as Prosumer
              </Button>
            </Link>
            <Link href="/register?role=consumer">
              <Button variant="outline" className="text-lg h-12 px-8">
                Browse Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-secondary/50">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-power-green to-power-amber rounded-lg flex items-center justify-center">
                  <Sun className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold">Power Hub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Trade energy. Power communities.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-3">Product</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">How It Works</a></li>
                <li><a href="#" className="hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground">Features</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-3">Company</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About</a></li>
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-3">Legal</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms</a></li>
                <li><a href="#" className="hover:text-foreground">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 Power Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
