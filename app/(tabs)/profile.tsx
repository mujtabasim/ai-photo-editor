import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, radii, shadows } from '../../src/theme/colors';
import { StatCard } from '../../src/components/ui/Cards';
import { SecondaryButton } from '../../src/components/ui/Buttons';
import { MOCK_USER } from '../../src/constants/mockData';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>My Profile</Text>

        {/* Profile Card */}
        <View style={[styles.profileCard, shadows.sm]}>
          <Image source={{ uri: MOCK_USER.avatarUrl }} style={styles.avatar} />
          <Text style={styles.name}>{MOCK_USER.name}</Text>
          <Text style={styles.email}>{MOCK_USER.email}</Text>
          <View style={styles.planBadge}>
            <Text style={styles.planBadgeText}>PRO MEMBER</Text>
          </View>
        </View>

        {/* Usage Stats Row */}
        <View style={styles.statsGrid}>
          <StatCard label="Total Exports" value={`${MOCK_USER.totalExports}`} subtext="+18 this week" />
          <StatCard label="AI Render Time" value="1.4 sec" subtext="Lightning Fast" />
        </View>

        {/* Storage Progress Card */}
        <View style={[styles.card, shadows.sm]}>
          <View style={styles.cardRow}>
            <Text style={styles.cardTitle}>Cloud Storage</Text>
            <Text style={styles.cardVal}>{MOCK_USER.storageUsedMB} MB / {MOCK_USER.storageLimitMB} MB</Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${(MOCK_USER.storageUsedMB / MOCK_USER.storageLimitMB) * 100}%` }]} />
          </View>
        </View>

        {/* Referral Card */}
        <TouchableOpacity
          onPress={() => router.push('/subscription')}
          style={[styles.referralCard, shadows.glow]}
        >
          <Text style={{ fontSize: 32, marginBottom: 8 }}>🎁</Text>
          <Text style={styles.refTitle}>Invite Friends, Get Pro Free</Text>
          <Text style={styles.refSub}>Share your code: {MOCK_USER.referralCode}</Text>
        </TouchableOpacity>

        {/* Shortcuts List */}
        <View style={[styles.menuCard, shadows.sm]}>
          <TouchableOpacity onPress={() => router.push('/settings')} style={styles.menuItem}>
            <Text style={styles.menuIcon}>⚙️</Text>
            <Text style={styles.menuText}>App Settings & Preferences</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity onPress={() => router.push('/subscription')} style={styles.menuItem}>
            <Text style={styles.menuIcon}>💎</Text>
            <Text style={styles.menuText}>Subscription & Plan Details</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity onPress={() => router.push('/settings')} style={styles.menuItem}>
            <Text style={styles.menuIcon}>❓</Text>
            <Text style={styles.menuText}>Help Center & Support</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <SecondaryButton
          title="Reset Workspace Session"
          onPress={() => router.replace('/(tabs)')}
          style={{ marginTop: 24 }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 110,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: radii['2xl'],
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  email: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  planBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.full,
    marginTop: 12,
  },
  planBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardVal: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  track: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  referralCard: {
    backgroundColor: colors.primary,
    borderRadius: radii['2xl'],
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  refTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  refSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    marginTop: 4,
  },
  menuCard: {
    backgroundColor: colors.card,
    borderRadius: radii['2xl'],
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  menuArrow: {
    fontSize: 18,
    color: colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
});
