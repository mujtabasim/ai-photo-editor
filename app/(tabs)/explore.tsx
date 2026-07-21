import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, radii, shadows } from '../../src/theme/colors';
import { MOCK_EXPLORE_TEMPLATES } from '../../src/constants/mockData';
import { AI_TOOLS_LIST } from '../../src/constants/aiTools';

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>AI Marketplace ✨</Text>
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
          <Text style={{ fontSize: 54 }}>🌟</Text>
        </TouchableOpacity>

        {/* Trending AI Presets Grid */}
        <Text style={styles.sectionTitle}>Trending Templates</Text>
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
                <Text style={styles.templateAuthor}>by {tpl.author} • ❤️ {tpl.likes}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

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
                <Text style={{ fontSize: 24 }}>✨</Text>
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
    backgroundColor: colors.secondaryBackground,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 110,
  },
  header: {
    marginBottom: 20,
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
    backgroundColor: colors.accent,
    borderRadius: radii['2xl'],
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  heroText: {
    flex: 1,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 14,
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
    borderColor: colors.borderLight,
  },
  templateImage: {
    width: '100%',
    height: 140,
  },
  tagBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 2,
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
  templateAuthor: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
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
    borderColor: colors.borderLight,
  },
  styleCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EEF2FF',
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
