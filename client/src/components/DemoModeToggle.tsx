import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { DEMO_ACCOUNTS } from '@/lib/demoAccounts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Sun, Zap, Settings, LogOut } from 'lucide-react';

export default function DemoModeToggle() {
  const { user, register, logout } = useAuth();
  const [, setLocation] = useLocation();

  if (!user) return null;

  const demoOptions = [
    { role: 'prosumer', label: 'Prosumer', icon: Sun },
    { role: 'consumer', label: 'Consumer', icon: Zap },
    { role: 'admin', label: 'Admin', icon: Settings },
  ];

  const handleSwitchRole = async (role: 'prosumer' | 'consumer' | 'admin') => {
    const demoAccount = DEMO_ACCOUNTS[role];
    try {
      await register(demoAccount.email, 'demo_password_123', demoAccount);
      const redirects: Record<string, string> = {
        prosumer: '/prosumer',
        consumer: '/consumer',
        admin: '/admin',
      };
      setLocation(redirects[role]);
    } catch (error) {
      console.error('Role switch failed:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          Demo Mode
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs">Switch Demo Role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {demoOptions.map((option) => {
          const Icon = option.icon;
          const isActive = user.role === option.role;
          return (
            <DropdownMenuItem
              key={option.role}
              onClick={() => handleSwitchRole(option.role as any)}
              className={isActive ? 'bg-secondary' : ''}
            >
              <Icon className="w-4 h-4 mr-2" />
              <span>{option.label}</span>
              {isActive && <span className="ml-auto text-xs">✓</span>}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()} className="text-red-600">
          <LogOut className="w-4 h-4 mr-2" />
          <span>Exit Demo</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
