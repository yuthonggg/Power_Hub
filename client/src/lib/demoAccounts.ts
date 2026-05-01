import { UserProfile } from '@/contexts/AuthContext';

export const DEMO_ACCOUNTS = {
  prosumer: {
    uid: 'demo_prosumer_001',
    email: 'prosumer@demo.com',
    name: 'Ahmad Hassan',
    role: 'prosumer' as const,
    walletBalance: 1250.75,
    solarCapacityKwp: 5.5,
    panelCount: 16,
    installationDate: '2023-06-15',
    postcode: '50000',
    isCapped: false,
    totalExportedKwh: 12450,
    totalEarningsRM: 4232.50,
  },
  consumer: {
    uid: 'demo_consumer_001',
    email: 'consumer@demo.com',
    name: 'Lim Hock',
    role: 'consumer' as const,
    walletBalance: 500.50,
    accountType: 'high_usage_home' as const,
    avgMonthlyUsageKwh: 800,
    activeSubscriptionId: 'sub_standard_001',
  },
  admin: {
    uid: 'demo_admin_001',
    email: 'admin@demo.com',
    name: 'Admin User',
    role: 'admin' as const,
    walletBalance: 0,
  },
} as Record<string, UserProfile>;

export const getDemoAccount = (role: 'prosumer' | 'consumer' | 'admin'): UserProfile => {
  return DEMO_ACCOUNTS[role];
};
