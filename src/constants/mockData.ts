import { ProjectHistory, UserProfile, SubscriptionPlan } from '../types';

export const MOCK_USER: UserProfile = {
  id: 'usr_guest',
  name: 'Guest User',
  email: 'Sign in to save projects',
  avatarUrl: '',
  plan: 'free',
  storageUsedMB: 0,
  storageLimitMB: 1000,
  referralCode: '',
  totalExports: 0,
  joinedDate: '2026',
};

export const MOCK_PROJECTS: ProjectHistory[] = [];

export const MOCK_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly_pro',
    name: 'Pro Monthly',
    priceMonthly: 12.99,
    priceYearly: 12.99 * 12,
    savingsPercentage: 0,
    features: [
      'Full HD & 4K AI Processing',
      'Background Removal & Object Eraser',
      'Unlimited Image Exports',
      'Fast AI Queue Processing',
    ],
  },
  {
    id: 'yearly_pro',
    name: 'Pro Annual',
    priceMonthly: 6.99,
    priceYearly: 83.88,
    savingsPercentage: 46,
    isPopular: true,
    features: [
      'Everything in Pro Monthly',
      'Best Value Annual Subscription',
      'Priority Cloud Processing',
    ],
  }
];

export const MOCK_EXPLORE_TEMPLATES: Array<{ id: string; title: string; author: string; likes: string; imageUrl: string; tag: string }> = [];
