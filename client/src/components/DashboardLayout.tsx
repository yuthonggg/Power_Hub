import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'wouter';
import Navbar from './Navbar';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
}

export default function DashboardLayout({ children, navItems }: DashboardLayoutProps) {
  const { logout } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar showAuth={false} />
      
      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed md:relative w-64 bg-sidebar border-r border-sidebar-border h-[calc(100vh-4rem)]
          transition-transform duration-300 z-40
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <nav className="p-6 space-y-2 overflow-y-auto h-full">
            {navItems.map((item) => {
              const isActive = location === item.href || (location.startsWith(item.href + '/') && item.href !== '/prosumer' && item.href !== '/consumer' && item.href !== '/admin');
              return (
                <Link key={item.href} href={item.href}>
                  <a
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                      ${isActive
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground font-semibold'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.icon && <span className="w-5 h-5">{item.icon}</span>}
                    <span>{item.label}</span>
                  </a>
                </Link>
              );
            })}
            
            <div className="pt-6 mt-6 border-t border-sidebar-border">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </nav>
        </aside>

        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed bottom-4 right-4 z-50 p-3 bg-primary text-white rounded-full shadow-lg"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
