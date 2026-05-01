import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'wouter';
import { Sun, LogOut, User, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DemoModeToggle from './DemoModeToggle';

interface NavbarProps {
  showAuth?: boolean;
}

export default function Navbar({ showAuth = true }: NavbarProps) {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link href="/">
          <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-power-green to-power-amber rounded-lg flex items-center justify-center">
              <Sun className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold" style={{ fontFamily: 'Geist, sans-serif' }}>
              Power Hub
            </span>
          </a>
        </Link>

        <div className="flex items-center gap-8">
          {!isAuthenticated && showAuth && (
            <>
              <Link href="/login">
                <a className="text-sm font-medium hover:text-primary transition-colors">
                  Login
                </a>
              </Link>
              <Link href="/register">
                <a>
                  <Button className="bg-primary hover:bg-primary/90">
                    Get Started
                  </Button>
                </a>
              </Link>
            </>
          )}

          {isAuthenticated && user && (
            <div className="flex items-center gap-4">
              <DemoModeToggle />
              <div className="text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user.role}
                </p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-10 h-10 rounded-full p-0">
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <a className="flex items-center gap-2 cursor-pointer">
                        <Settings className="w-4 h-4" />
                        Settings
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
