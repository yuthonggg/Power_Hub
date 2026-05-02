import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'prosumer' | 'consumer' | 'admin';
export type ConsumerAccountType = 'shoplet' | 'high_usage_home' | 'ev_home' | 'office' | 'clinic' | 'cafe' | 'laundromat';
export type SubscriptionPlan = 'Standard' | 'Plus' | 'Pro';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  eWalletBalance: number; // RM
  tNBAccountNumber?: string;
  address?: string;
  createdAt: number;
  
  // Prosumer-specific
  solarCapacityKwp?: number;
  panelCount?: number;
  installationDate?: string;
  postcode?: string;
  monthlyExportLimitKwh?: number; // set by admin
  exportEnabled?: boolean;
  totalExportedKwh?: number; // lifetime
  totalEarningsRM?: number; // lifetime
  
  // Consumer-specific
  accountType?: ConsumerAccountType;
  avgMonthlyUsageKwh?: number;
  activeSubscriptionId?: string | null;
  activeSubscriptionPlan?: SubscriptionPlan | null;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, profileData: Partial<UserProfile>) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockUser: UserProfile = {
        uid: 'user_' + Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        role: 'prosumer',
        eWalletBalance: 250.50,
        address: '123 Jalan Ampang, 50450 Kuala Lumpur',
        createdAt: Date.now(),
        solarCapacityKwp: 5.5,
        panelCount: 16,
        installationDate: '2023-06-15',
        postcode: '50000',
        monthlyExportLimitKwh: 200,
        exportEnabled: true,
        totalExportedKwh: 12450,
        totalEarningsRM: 4232.50,
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (
    email: string,
    password: string,
    profileData: Partial<UserProfile>
  ) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newUser: UserProfile = {
        uid: 'user_' + Math.random().toString(36).substr(2, 9),
        email,
        name: profileData.name || email.split('@')[0],
        role: profileData.role || 'consumer',
        eWalletBalance: profileData.eWalletBalance || 0,
        address: profileData.address || '123 Jalan Ampang, 50450 Kuala Lumpur',
        createdAt: Date.now(),
        ...profileData,
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    }
  }, [user]);

  React.useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to restore user:', e);
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
