import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, Heart } from 'lucide-react-native';
import { colors, radii, shadows } from '../../src/theme/colors';
import { MOCK_EXPLORE_TEMPLATES } from '../../src/constants/mockData';
import { AI_TOOLS_LIST } from '../../src/constants/aiTools';
import { getLucideIcon } from '../../src/components/ui/Cards';

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>AI Marketplace</Text>
            <Sparkles size={20} color={colors.primary} />
          </View>
          <Text style={styles.subtitle}>Discover community templates, trending styles & prompt tools</Text>
        </View>

        {/* Hero Featured Banner */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push('/ai-tools')}
          style={[styles.heroBanner, shadows.glow]}
        >
          <View style={styles.heroText}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>FEATURED COLLECTION</Text>
            </View>
            <Text style={styles.heroTitle}>Studio Portrait Presets v3</Text>
            <Text style={styles.heroSub}>Cinematic lighting & skin retouching in 1 tap</Text>
          </View>
          <View style={styles.heroIconFrame}>
            <Sparkles size={32} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        {/* Trending AI Presets Grid */}
        <Text style={styles.sectionTitle}>Trending Templates</Text>
        {MOCK_EXPLORE_TEMPLATES.length === 0 ? (
          <View style={[styles.emptyTemplatesCard, shadows.sm]}>
            <Sparkles size={32} color={colors.textMuted} />
            <Text style={styles.emptyTemplatesTitle}>No Community Templates</Text>
            <Text style={styles.emptyTemplatesSub}>Community presets and styles will appear here.</Text>
          </View>
        ) : (
          <View style={styles.templatesGrid}>
            {MOCK_EXPLORE_TEMPLATES.map((tpl) => (
              <TouchableOpacity
                key={tpl.id}
                activeOpacity={0.88}
                onPress={() => router.push('/editor')}
                style={[styles.templateCard, shadows.sm]}
              >
                <Image source={{ uri: tpl.imageUrl }} style={styles.templateImage} />
                <View style={styles.tagBadge}>
                  <Text style={styles.tagText}>{tpl.tag}</Text>
                </View>
                <View style={styles.templateMeta}>
                  <Text style={styles.templateTitle} numberOfLines={1}>{tpl.title}</Text>
                  <View style={styles.authorRow}>
                    <Text style={styles.templateAuthor}>by {tpl.author}</Text>
                    <View style={styles.likesRow}>
                      <Heart size={11} color={colors.error} fill={colors.error} />
                      <Text style={styles.likesText}>{tpl.likes}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Popular AI Styles Carousel */}
        <Text style={styles.sectionTitle}>Popular Styles</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.styleScroll}>
          {AI_TOOLS_LIST.filter(t => t.category === 'style' || t.category === 'generative').map((tool) => (
            <TouchableOpacity
              key={tool.id}
              onPress={() => router.push('/editor')}
              style={[styles.styleCard, shadows.sm]}
            >
              <View style={styles.styleCircle}>
                {getLucideIcon(tool.iconName, 20, colors.primary)}
              </View>
              <Text style={styles.styleName}>{tool.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
  header: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  heroBanner: {
    backgroundColor: colors.primary,
    borderRadius: radii['2xl'],
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  heroText: {
    flex: 1,
    paddingRight: 12,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeText: {
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
  heroSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
  },
  heroIconFrame: {
    width: 52,
    height: 52,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 14,
  },
  emptyTemplatesCard: {
    backgroundColor: colors.card,
    borderRadius: radii['2xl'],
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTemplatesTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 8,
  },
  emptyTemplatesSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  templateCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: radii['2xl'],
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  templateImage: {
    width: '100%',
    height: 140,
  },
  tagBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(17, 24, 39, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  templateMeta: {
    padding: 10,
  },
  templateTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  templateAuthor: {
    fontSize: 11,
    color: colors.textMuted,
  },
  likesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  likesText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  styleScroll: {
    gap: 12,
    paddingBottom: 8,
  },
  styleCard: {
    width: 110,
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  styleCircle: {
    width: 48,
    height: 48,
    borderRadius: radii.full,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  styleName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
