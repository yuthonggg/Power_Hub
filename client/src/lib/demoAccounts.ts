import { UserProfile } from '@/contexts/AuthContext';

export const DEMO_ACCOUNTS: Record<string, UserProfile> = {
  prosumer: {
    uid: 'demo_prosumer_001',
    email: 'prosumer@demo.com',
    name: 'Ahmad Hassan',
    role: 'prosumer',
    eWalletBalance: 1250.75,
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
  },
  consumer: {
    uid: 'demo_consumer_001',
    email: 'consumer@demo.com',
    name: 'Lim Hock',
    role: 'consumer',
    eWalletBalance: 500.50,
    address: '45 Jalan Bangsar, 59100 Kuala Lumpur',
    createdAt: Date.now(),
    accountType: 'high_usage_home',
    avgMonthlyUsageKwh: 800,
    activeSubscriptionId: 'sub_standard_001',
    activeSubscriptionPlan: 'Plus',
  },
  admin: {
    uid: 'demo_admin_001',
    email: 'admin@demo.com',
    name: 'Admin User',
    role: 'admin',
    eWalletBalance: 0,
    createdAt: Date.now(),
  },
};

export const getDemoAccount = (role: 'prosumer' | 'consumer' | 'admin'): UserProfile => {
  return DEMO_ACCOUNTS[role];
};
