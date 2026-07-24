import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Settings, Upload, Camera, Sparkles, ChevronRight, FolderOpen, User } from 'lucide-react-native';
import { colors, radii, shadows } from '../../src/theme/colors';
import { SearchBar, Chip } from '../../src/components/ui/Inputs';
import { FeatureCard } from '../../src/components/ui/Cards';
import { AI_TOOLS_LIST } from '../../src/constants/aiTools';
import { useHistoryStore } from '../../src/store/useHistoryStore';
import { useEditorStore } from '../../src/store/useEditorStore';
import { useAuth } from '../../src/hooks/useAuth';

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
  const { projects, fetchProjects } = useHistoryStore();
  const setProject = useEditorStore((s) => s.setProject);
  const { user, profile } = useAuth();

  useEffect(() => {
    if (user?.id) {
      console.log(`[HomeScreen] Loading projects for user_id: ${user.id}`);
      fetchProjects();
    }
  }, [user?.id]);

  const greetingName = profile?.display_name || user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Creative';
  const userAvatar = profile?.avatar_url;

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} style={styles.avatarFrame}>
            {userAvatar ? (
              <Image source={{ uri: userAvatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={20} color={colors.primary} />
              </View>
            )}
          </TouchableOpacity>
          <View>
            <Text style={styles.greetingText}>Hi, {greetingName}</Text>
            <Text style={styles.subtitleText}>{user?.email || 'AI Photo Editor'}</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => router.push('/settings')} style={styles.glassIconButton}>
            <Settings size={18} color={colors.textPrimary} />
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

        {/* Hero Section */}
        <View style={[styles.heroContainer, shadows.sm]}>
          <View style={styles.heroMainCol}>
            <Text style={styles.heroTitle}>Transform Photos with AI</Text>
            <Text style={styles.heroSubtitle}>Upload an image to start editing with AI tools.</Text>
            
            <View style={styles.heroBtnRow}>
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() => router.push('/upload')}
                style={styles.primaryActionBtn}
              >
                <Upload size={16} color="#FFFFFF" />
                <Text style={styles.primaryActionBtnText}>Upload Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() => router.push('/upload')}
                style={styles.secondaryActionBtn}
              >
                <Camera size={16} color={colors.textPrimary} />
                <Text style={styles.secondaryActionBtnText}>Open Camera</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Continue Editing Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Continue Editing</Text>
          {projects.length > 0 && (
            <TouchableOpacity onPress={() => router.push('/(tabs)/history')} style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>View All</Text>
              <ChevronRight size={14} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        {projects.length === 0 ? (
          <View style={[styles.emptyProjectsCard, shadows.sm]}>
            <FolderOpen size={32} color={colors.textMuted} />
            <Text style={styles.emptyProjectsTitle}>No recent projects</Text>
            <Text style={styles.emptyProjectsSub}>Your edited images will appear here.</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentScroll}>
            {projects.slice(0, 3).map((proj) => (
              <TouchableOpacity
                key={proj.id}
                activeOpacity={0.88}
                onPress={() => {
                  setProject(proj);
                  router.push({ pathname: '/editor', params: { projectId: proj.id } });
                }}
                style={[styles.recentCard, shadows.sm]}
              >
                <View style={styles.recentThumbFrame}>
                  <Image source={{ uri: proj.thumbnailUrl }} style={styles.recentThumb} />
                  <View style={styles.toolTagOverlay}>
                    <Text style={styles.toolTagText}>{proj.toolUsed}</Text>
                  </View>
                </View>

                <View style={styles.cardInfoContainer}>
                  <Text style={styles.recentTitle} numberOfLines={1}>{proj.title}</Text>
                  <Text style={styles.recentMeta}>{proj.createdAt}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* AI Tools Grid */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>AI Tools</Text>
          <TouchableOpacity onPress={() => router.push('/ai-tools')} style={styles.seeAllBtn}>
            <Text style={styles.seeAllText}>View All</Text>
            <ChevronRight size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.featuredGrid}>
          {AI_TOOLS_LIST.slice(0, 6).map((tool) => (
            <FeatureCard
              key={tool.id}
              title={tool.name}
              description={tool.description}
              iconName={tool.iconName}
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
    backgroundColor: 'rgba(250, 250, 252, 0.92)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 36,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 1000,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarFrame: {
    width: 42,
    height: 42,
    borderRadius: radii.full,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitleText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  glassIconButton: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 106,
    paddingBottom: 110,
  },
  categoryScroll: {
    gap: 8,
    marginBottom: 20,
    paddingBottom: 2,
  },
  heroContainer: {
    backgroundColor: '#F5F3FF',
    borderRadius: radii['2xl'],
    borderWidth: 1,
    borderColor: '#EDE9FE',
    padding: 24,
    marginBottom: 28,
  },
  heroMainCol: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 18,
    fontWeight: '400',
  },
  heroBtnRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  primaryActionBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radii.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...shadows.md,
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  secondaryActionBtn: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radii.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryActionBtnText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 4,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyProjectsCard: {
    backgroundColor: colors.card,
    borderRadius: radii['2xl'],
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyProjectsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 8,
  },
  emptyProjectsSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  recentScroll: {
    gap: 14,
    marginBottom: 28,
    paddingBottom: 4,
  },
  recentCard: {
    width: 175,
    backgroundColor: colors.card,
    borderRadius: radii['2xl'],
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  recentThumbFrame: {
    width: '100%',
    height: 115,
    position: 'relative',
    backgroundColor: colors.border,
  },
  recentThumb: {
    width: '100%',
    height: '100%',
  },
  toolTagOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(17, 24, 39, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  toolTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  cardInfoContainer: {
    padding: 12,
  },
  recentTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  recentMeta: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3,
    fontWeight: '500',
  },
  featuredGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
