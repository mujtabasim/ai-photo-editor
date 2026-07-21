import { create } from 'zustand';
import { SubscriptionPlan } from '../types';
import { MOCK_SUBSCRIPTION_PLANS } from '../constants/mockData';

interface SubscriptionState {
  plans: SubscriptionPlan[];
  selectedPlanId: string;
  isYearlyBilling: boolean;
  isSubscribed: boolean;
  setSelectedPlanId: (id: string) => void;
  toggleBillingCycle: () => void;
  subscribe: (planId: string) => Promise<void>;
  restorePurchases: () => Promise<boolean>;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  plans: MOCK_SUBSCRIPTION_PLANS,
  selectedPlanId: 'yearly_pro',
  isYearlyBilling: true,
  isSubscribed: true,

  setSelectedPlanId: (id) => set({ selectedPlanId: id }),

  toggleBillingCycle: () => set((state) => ({ isYearlyBilling: !state.isYearlyBilling })),

  subscribe: async (planId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    set({ isSubscribed: true, selectedPlanId: planId });
  },

  restorePurchases: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({ isSubscribed: true });
    return true;
  },
}));
