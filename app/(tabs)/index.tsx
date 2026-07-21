import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, radii, shadows } from '../../src/theme/colors';
import { SearchBar } from '../../src/components/ui/Inputs';
import { FeatureCard, GlassCard, StatCard } from '../../src/components/ui/Cards';
import { PrimaryButton, GradientButton } from '../../src/components/ui/Buttons';
import { MOCK_USER, MOCK_PROJECTS } from '../../src/constants/mockData';
import { AI_TOOLS_LIST } from '../../src/constants/aiTools';

export default function HomeScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Greeting & Avatar */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greetingText}>Good afternoon 👋</Text>
            <Text style={styles.userName}>{MOCK_USER.name}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
            <Image source={{ uri: MOCK_USER.avatarUrl }} style={styles.avatar} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search AI Tools, Eraser, Upscale..."
        />

        {/* Hero Quick Start CTA */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push('/upload')}
          style={[styles.heroCard, shadows.glow]}
        >
          <View style={styles.heroTextCol}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>AI WORKSPACE v2.0</Text>
            </View>
            <Text style={styles.heroTitle}>Create New Project</Text>
            <Text style={styles.heroSubtitle}>Upload image, take photo, or import multiple photos</Text>
            <PrimaryButton
              title="Start Upload"
              onPress={() => router.push('/upload')}
              style={styles.heroBtn}
            />
          </View>
          <Text style={{ fontSize: 64 }}>🎨</Text>
        </TouchableOpacity>

        {/* Quick Actions Grid */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          <TouchableOpacity
            onPress={() => router.push('/upload')}
            style={[styles.quickCard, { backgroundColor: '#EEF2FF' }]}
          >
            <Text style={{ fontSize: 24, marginBottom: 6 }}>📤</Text>
            <Text style={styles.quickCardTitle}>Upload Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/upload')}
            style={[styles.quickCard, { backgroundColor: '#FDF2F8' }]}
          >
            <Text style={{ fontSize: 24, marginBottom: 6 }}>📸</Text>
            <Text style={styles.quickCardTitle}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/ai-tools')}
            style={[styles.quickCard, { backgroundColor: '#F0FDF4' }]}
          >
            <Text style={{ fontSize: 24, marginBottom: 6 }}>⚡</Text>
            <Text style={styles.quickCardTitle}>All AI Tools</Text>
          </TouchableOpacity>
        </View>

        {/* Continue Editing Card */}
        <Text style={styles.sectionTitle}>Continue Editing</Text>
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => router.push('/editor')}
          style={[styles.continueCard, shadows.sm]}
        >
          <Image source={{ uri: MOCK_PROJECTS[0].thumbnailUrl }} style={styles.continueThumb} />
          <View style={styles.continueInfo}>
            <Text style={styles.continueTitle}>{MOCK_PROJECTS[0].title}</Text>
            <Text style={styles.continueTool}>Tool: {MOCK_PROJECTS[0].toolUsed}</Text>
            <Text style={styles.continueTime}>{MOCK_PROJECTS[0].createdAt}</Text>
          </View>
          <PrimaryButton
            title="Resume"
            onPress={() => router.push('/editor')}
            size="sm"
          />
        </TouchableOpacity>

        {/* Recent Projects Horizontal Carousel */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Projects</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselContainer}>
          {MOCK_PROJECTS.map((proj) => (
            <TouchableOpacity
              key={proj.id}
              activeOpacity={0.88}
              onPress={() => router.push('/editor')}
              style={[styles.projectCard, shadows.sm]}
            >
              <Image source={{ uri: proj.thumbnailUrl }} style={styles.projectThumb} />
              <Text style={styles.projectTitle} numberOfLines={1}>{proj.title}</Text>
              <Text style={styles.projectSubtitle}>{proj.toolUsed}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured AI Tools */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Featured AI Tools</Text>
          <TouchableOpacity onPress={() => router.push('/ai-tools')}>
            <Text style={styles.seeAllText}>View 24+ Tools</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.featuredGrid}>
          {AI_TOOLS_LIST.slice(0, 4).map((tool) => (
            <FeatureCard
              key={tool.id}
              title={tool.name}
              description={tool.description}
              badge={tool.badgeText}
              isComingSoon={tool.isComingSoon}
              onPress={() => router.push('/editor')}
            />
          ))}
        </View>

        {/* Storage & Subscription Cards */}
        <View style={styles.statsRow}>
          <GlassCard style={{ flex: 1 }}>
            <Text style={styles.glassLabel}>Cloud Storage</Text>
            <Text style={styles.glassVal}>1.42 GB / 5 GB</Text>
            <View style={styles.storageBar}>
              <View style={[styles.storageFill, { width: '28%' }]} />
            </View>
          </GlassCard>

          <TouchableOpacity
            onPress={() => router.push('/subscription')}
            style={[styles.proBannerCard, shadows.sm]}
          >
            <Text style={styles.proTitle}>PRO PLAN ACTIVE</Text>
            <Text style={styles.proSub}>Unlimited 4K exports enabled</Text>
          </TouchableOpacity>
        </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: radii['2xl'],
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  heroTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  heroBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
    marginBottom: 8,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    marginBottom: 16,
    lineHeight: 16,
  },
  heroBtn: {
    backgroundColor: '#FFFFFF',
    height: 40,
    alignSelf: 'flex-start',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  seeAllText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  quickGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  quickCard: {
    flex: 1,
    borderRadius: radii.xl,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  continueCard: {
    backgroundColor: colors.card,
    borderRadius: radii['2xl'],
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  continueThumb: {
    width: 64,
    height: 64,
    borderRadius: radii.lg,
  },
  continueInfo: {
    flex: 1,
  },
  continueTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  continueTool: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  continueTime: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  carouselContainer: {
    gap: 12,
    paddingBottom: 8,
    marginBottom: 20,
  },
  projectCard: {
    width: 140,
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  projectThumb: {
    width: '100%',
    height: 100,
    borderRadius: radii.lg,
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  projectSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  featuredGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  glassLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  glassVal: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginVertical: 4,
  },
  storageBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  storageFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  proBannerCard: {
    flex: 1,
    backgroundColor: '#FAF5FF',
    borderRadius: radii['2xl'],
    padding: 16,
    borderWidth: 1,
    borderColor: colors.accentLight,
    justifyContent: 'center',
  },
  proTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.accent,
    marginBottom: 2,
  },
  proSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});
