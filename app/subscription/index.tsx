import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, radii, shadows } from '../../src/theme/colors';
import { PlanCard } from '../../src/components/ui/Cards';
import { PrimaryButton, SecondaryButton } from '../../src/components/ui/Buttons';
import { SegmentedControl } from '../../src/components/ui/Inputs';
import { useSubscriptionStore } from '../../src/store/useSubscriptionStore';
import { useHaptics } from '../../src/hooks/useHaptics';

export default function SubscriptionScreen() {
  const router = useRouter();
  const { notificationSuccess } = useHaptics();
  const { plans, selectedPlanId, setSelectedPlanId, isYearlyBilling, toggleBillingCycle, subscribe, restorePurchases } = useSubscriptionStore();

  const handleSubscribe = async () => {
    await subscribe(selectedPlanId);
    notificationSuccess();
    router.back();
  };

  const handleRestore = async () => {
    await restorePurchases();
    notificationSuccess();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Close */}
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.crownCircle}>
            <Text style={{ fontSize: 48 }}>👑</Text>
          </View>
          <Text style={styles.heroTitle}>Unlock AI Photo Studio Pro</Text>
          <Text style={styles.heroSub}>Access all 24+ AI models, 4K upscaling, and unlimited exports</Text>
        </View>

        {/* Billing Cycle Toggle */}
        <SegmentedControl
          options={['Monthly Billing', 'Yearly Billing (-46%)']}
          selectedIndex={isYearlyBilling ? 1 : 0}
          onSelect={toggleBillingCycle}
        />

        {/* Plan Cards */}
        {plans.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          const displayPrice = isYearlyBilling ? `$${plan.priceMonthly}/mo` : `$${plan.priceMonthly}/mo`;
          const displayPeriod = isYearlyBilling ? 'Billed annually ($83.88/yr)' : 'Billed monthly';

          return (
            <PlanCard
              key={plan.id}
              title={plan.name}
              price={displayPrice}
              period={displayPeriod}
              isSelected={isSelected}
              isPopular={plan.isPopular}
              onSelect={() => setSelectedPlanId(plan.id)}
            />
          );
        })}

        {/* Benefits Check List */}
        <View style={[styles.benefitsCard, shadows.sm]}>
          <Text style={styles.benefitsTitle}>Pro Subscription Includes:</Text>
          <Text style={styles.benefitItem}>✓ Unlimited 4K AI Upscaling & Enhancements</Text>
          <Text style={styles.benefitItem}>✓ Instant Background Cutouts with Crisp Edges</Text>
          <Text style={styles.benefitItem}>✓ Generative AI Fill & Outpainting Models</Text>
          <Text style={styles.benefitItem}>✓ Batch Processing up to 50 photos simultaneously</Text>
          <Text style={styles.benefitItem}>✓ High Priority Cloud Rendering Queue</Text>
          <Text style={styles.benefitItem}>✓ Commercial License & RAW File Export</Text>
        </View>

        {/* Subscribe Action */}
        <PrimaryButton
          title="Continue to Purchase"
          onPress={handleSubscribe}
          style={styles.continueBtn}
        />

        {/* Restore Purchases */}
        <TouchableOpacity onPress={handleRestore} style={styles.restoreBtn}>
          <Text style={styles.restoreText}>Restore Existing Purchases</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          Recurring billing. Cancel anytime in App Store / Google Play settings.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  crownCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FAF5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  heroSub: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  benefitsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: radii['2xl'],
    padding: 20,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  benefitsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  benefitItem: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  continueBtn: {
    height: 54,
    marginTop: 8,
  },
  restoreBtn: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  restoreText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  termsText: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
});
