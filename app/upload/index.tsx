import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, radii, shadows } from '../../src/theme/colors';
import { PrimaryButton, SecondaryButton } from '../../src/components/ui/Buttons';
import { GlassCard } from '../../src/components/ui/Cards';
import { useEditorStore } from '../../src/store/useEditorStore';
import { MOCK_PROJECTS } from '../../src/constants/mockData';

export default function UploadScreen() {
  const router = useRouter();
  const setSelectedImage = useEditorStore((s) => s.setSelectedImage);

  const handleSelectSample = (uri: string) => {
    setSelectedImage(uri);
    router.replace('/editor');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>✕ Close</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Import Photos</Text>
          <Text style={styles.subtitle}>Select an image to process with AI models</Text>
        </View>

        {/* Drag & Drop / Tap Dropzone */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => handleSelectSample('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200')}
          style={[styles.dropzone, shadows.sm]}
        >
          <View style={styles.dropIconBox}>
            <Text style={{ fontSize: 40 }}>☁️</Text>
          </View>
          <Text style={styles.dropTitle}>Tap to Select Image from Photo Library</Text>
          <Text style={styles.dropSub}>or drag & drop file here (PNG, JPG, RAW)</Text>
          <PrimaryButton
            title="Browse Files"
            onPress={() => handleSelectSample('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200')}
            style={{ marginTop: 16 }}
          />
        </TouchableOpacity>

        {/* Action Grid */}
        <View style={styles.actionGrid}>
          <TouchableOpacity
            onPress={() => handleSelectSample('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200')}
            style={[styles.actionCard, { backgroundColor: '#EEF2FF' }]}
          >
            <Text style={{ fontSize: 28, marginBottom: 8 }}>📸</Text>
            <Text style={styles.actionTitle}>Take Photo</Text>
            <Text style={styles.actionSub}>Use device camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSelectSample('https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1200')}
            style={[styles.actionCard, { backgroundColor: '#FAF5FF' }]}
          >
            <Text style={{ fontSize: 28, marginBottom: 8 }}>📚</Text>
            <Text style={styles.actionTitle}>Batch Import</Text>
            <Text style={styles.actionSub}>Select up to 50 items</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Imports */}
        <Text style={styles.sectionTitle}>Recent Camera Roll Imports</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentScroll}>
          {MOCK_PROJECTS.map((p) => (
            <TouchableOpacity
              key={p.id}
              onPress={() => handleSelectSample(p.originalUrl)}
              style={styles.recentItem}
            >
              <Image source={{ uri: p.thumbnailUrl }} style={styles.recentThumb} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Supported Formats Card */}
        <GlassCard style={{ marginTop: 24 }}>
          <Text style={styles.formatTitle}>Supported Input Formats</Text>
          <Text style={styles.formatList}>• JPEG, PNG, WEBP, HEIC, HEIF, TIFF</Text>
          <Text style={styles.formatList}>• Camera RAW (CR2, NEF, ARW, DNG)</Text>
          <Text style={styles.formatList}>• Max resolution up to 8K (50MB max file size)</Text>
        </GlassCard>
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
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  backBtn: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  backText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
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
  dropzone: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii['2xl'],
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
  },
  dropIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  dropTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  dropSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    borderRadius: radii['2xl'],
    padding: 16,
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  actionSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  recentScroll: {
    gap: 10,
  },
  recentItem: {
    width: 80,
    height: 80,
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  recentThumb: {
    width: '100%',
    height: '100%',
  },
  formatTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  formatList: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
