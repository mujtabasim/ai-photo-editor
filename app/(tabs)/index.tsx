import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, radii, shadows } from '../../src/theme/colors';
import { SearchBar, Chip } from '../../src/components/ui/Inputs';
import { FeatureCard, GlassCard } from '../../src/components/ui/Cards';
import { PrimaryButton, SecondaryButton } from '../../src/components/ui/Buttons';
import { MOCK_USER, MOCK_PROJECTS } from '../../src/constants/mockData';
import { AI_TOOLS_LIST } from '../../src/constants/aiTools';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  'Remove Background',
  'AI Eraser',
  'AI Replace',
  'AI Expand',
  'Upscale',
  'AI Portrait'
];

export default function HomeScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('Remove Background');

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} style={styles.avatarFrame}>
            <Image source={{ uri: MOCK_USER.avatarUrl }} style={styles.avatar} />
          </TouchableOpacity>
          <View>
            <Text style={styles.greetingText}>Hi, Creative</Text>
            <Text style={styles.subtitleText}>Lumina AI Studio</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => router.push('/settings')} style={styles.iconButton}>
            <Text style={styles.headerIcon}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/settings')} style={styles.iconButton}>
            <Text style={styles.headerIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Input */}
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Remove background, Erase objects, Upscale..."
        />

        {/* Horizontal Category Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              isSelected={selectedCat === cat}
              onPress={() => setSelectedCat(cat)}
            />
          ))}
        </ScrollView>

        {/* Hero Gradient Workspace Card */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push('/upload')}
          style={[styles.heroCard, shadows.glow]}
        >
          <View style={styles.heroOverlay}>
            <View style={styles.glassBadge}>
              <Text style={styles.glassBadgeText}>✨ Auto Awesome</Text>
            </View>
            <Text style={styles.heroTitle}>Create Something Amazing</Text>
            <Text style={styles.heroSubtitle}>Upload a photo and let AI transform it.</Text>
            
            <View style={styles.heroBtnRow}>
              <TouchableOpacity
                onPress={() => router.push('/upload')}
                style={styles.whiteBtn}
              >
                <Text style={styles.whiteBtnText}>📤 Upload</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/upload')}
                style={styles.glassDarkBtn}
              >
                <Text style={styles.glassDarkBtnText}>📸 Camera</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        {/* Continue Editing Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Continue Editing</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentScroll}>
          {MOCK_PROJECTS.slice(0, 3).map((proj, idx) => (
            <TouchableOpacity
              key={proj.id}
              activeOpacity={0.88}
              onPress={() => router.push('/editor')}
              style={styles.recentCard}
            >
              <View style={styles.recentThumbFrame}>
                <Image source={{ uri: proj.thumbnailUrl }} style={styles.recentThumb} />
                {/* Progress bar overlay */}
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: idx === 0 ? '75%' : '40%' }]} />
                </View>
              </View>
              <Text style={styles.recentTitle} numberOfLines={1}>{proj.title}</Text>
              <Text style={styles.recentMeta}>
                {idx === 0 ? '2m ago • 75% complete' : '1h ago • 40% complete'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trending AI Tools */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Trending AI Tools</Text>
          <TouchableOpacity onPress={() => router.push('/ai-tools')}>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featuredGrid}>
          {AI_TOOLS_LIST.slice(0, 6).map((tool) => (
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: 'rgba(254, 247, 255, 0.92)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 36,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderLight,
    zIndex: 1000,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarFrame: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(107, 56, 212, 0.2)',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitleText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 110,
    paddingBottom: 110,
  },
  categoryScroll: {
    gap: 6,
    marginBottom: 20,
    paddingBottom: 4,
  },
  heroCard: {
    borderRadius: radii.xl,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: colors.primary,
  },
  heroOverlay: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  glassBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    alignSelf: 'flex-start',
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  glassBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 20,
    lineHeight: 18,
  },
  heroBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  whiteBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: radii.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  whiteBtnText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  glassDarkBtn: {
    backgroundColor: 'rgba(107, 56, 212, 0.15)',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: radii.full,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  glassDarkBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  seeAllText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  recentScroll: {
    gap: 12,
    marginBottom: 24,
    paddingBottom: 6,
  },
  recentCard: {
    width: 170,
  },
  recentThumbFrame: {
    width: '100%',
    height: 110,
    borderRadius: radii.lg,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.borderLight,
    marginBottom: 6,
  },
  recentThumb: {
    width: '100%',
    height: '100%',
  },
  progressBarBg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  recentTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  recentMeta: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  featuredGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
