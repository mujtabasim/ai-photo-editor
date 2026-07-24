import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Settings, Crown, HelpCircle, ChevronRight, LogOut } from 'lucide-react-native';
import { colors, radii, shadows } from '../../src/theme/colors';
import { StatCard } from '../../src/components/ui/Cards';
import { SecondaryButton } from '../../src/components/ui/Buttons';
import { useHistoryStore } from '../../src/store/useHistoryStore';
import { useAuth } from '../../src/hooks/useAuth';
import { useHaptics } from '../../src/hooks/useHaptics';

export default function ProfileScreen() {
  const router = useRouter();
  const { projects } = useHistoryStore();
  const { user, profile, signOut } = useAuth();
  const { lightImpact } = useHaptics();

  const displayName = profile?.display_name || user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';
  const email = user?.email || 'No email registered';
  const subscriptionText = (profile?.subscription || 'Free Member').toUpperCase();
  const creditsText = profile?.credits !== undefined ? `${profile.credits}` : 'Unlimited';

  const handleSignOut = async () => {
    lightImpact();
    await signOut();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>My Profile</Text>

        {/* Profile Card */}
        <View style={[styles.profileCard, shadows.sm]}>
          {profile?.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.avatarImg} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <User size={36} color={colors.primary} />
            </View>
          )}
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
          <View style={styles.planBadge}>
            <Text style={styles.planBadgeText}>{subscriptionText}</Text>
          </View>
        </View>

        {/* Usage Stats Row */}
        <View style={styles.statsGrid}>
          <StatCard label="Saved Projects" value={`${projects.length}`} subtext="In Local Workspace" />
          <StatCard label="AI Credits" value={creditsText} subtext="Available Balance" />
        </View>

        {/* Shortcuts List */}
        <View style={[styles.menuCard, shadows.sm]}>
          <TouchableOpacity onPress={() => router.push('/settings')} style={styles.menuItem}>
            <View style={styles.menuIconBox}>
              <Settings size={18} color={colors.primary} />
            </View>
            <Text style={styles.menuText}>App Settings & Preferences</Text>
            <ChevronRight size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity onPress={() => router.push('/subscription')} style={styles.menuItem}>
            <View style={styles.menuIconBox}>
              <Crown size={18} color={colors.primary} />
            </View>
            <Text style={styles.menuText}>Subscription Details</Text>
            <ChevronRight size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity onPress={() => router.push('/settings')} style={styles.menuItem}>
            <View style={styles.menuIconBox}>
              <HelpCircle size={18} color={colors.primary} />
            </View>
            <Text style={styles.menuText}>Help Center & Support</Text>
            <ChevronRight size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handleSignOut}
          style={[styles.signOutBtn, shadows.sm]}
        >
          <LogOut size={18} color={colors.error} />
          <Text style={styles.signOutBtnText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    borderColor: colors.border,
  },
  avatarImg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: radii.full,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
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
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.full,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#EDE9FE',
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
  menuCard: {
    backgroundColor: colors.card,
    borderRadius: radii['2xl'],
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  signOutBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: radii.full,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
  },
  signOutBtnText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '700',
  },
});
