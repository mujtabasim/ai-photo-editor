import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, radii, shadows } from '../../src/theme/colors';
import { ConfirmationModal } from '../../src/components/ui/Feedback';
import { useSettingsStore } from '../../src/store/useSettingsStore';

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, updateSetting } = useSettingsStore();

  const [deleteModal, setDeleteModal] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Preferences Section */}
        <Text style={styles.sectionHeader}>Preferences</Text>
        <View style={[styles.card, shadows.sm]}>
          <View style={styles.row}>
            <Text style={styles.label}>Auto-Save Exports to Camera Roll</Text>
            <Switch
              value={settings.autoSaveToGallery}
              onValueChange={(val) => updateSetting('autoSaveToGallery', val)}
              trackColor={{ false: '#E2E8F0', true: colors.primary }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>High-Quality 4K Exports</Text>
            <Switch
              value={settings.highQualityExport}
              onValueChange={(val) => updateSetting('highQualityExport', val)}
              trackColor={{ false: '#E2E8F0', true: colors.primary }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Push Notifications</Text>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={(val) => updateSetting('notificationsEnabled', val)}
              trackColor={{ false: '#E2E8F0', true: colors.primary }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Haptic Feedback</Text>
            <Switch
              value={settings.hapticsEnabled}
              onValueChange={(val) => updateSetting('hapticsEnabled', val)}
              trackColor={{ false: '#E2E8F0', true: colors.primary }}
            />
          </View>
        </View>

        {/* General Options Section */}
        <Text style={styles.sectionHeader}>General</Text>
        <View style={[styles.card, shadows.sm]}>
          <View style={styles.row}>
            <Text style={styles.label}>Language</Text>
            <Text style={styles.valText}>{settings.language}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>App Version</Text>
            <Text style={styles.valText}>v2.4.0 (Build 2026.07)</Text>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity onPress={() => {}} style={styles.row}>
            <Text style={styles.label}>Privacy Policy & Data Security</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity onPress={() => {}} style={styles.row}>
            <Text style={styles.label}>Terms of Service</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Workspace Actions */}
        <Text style={styles.sectionHeader}>Workspace Actions</Text>
        <View style={[styles.card, shadows.sm]}>
          <TouchableOpacity onPress={() => setDeleteModal(true)} style={styles.row}>
            <Text style={[styles.label, { color: colors.error }]}>Clear Cache & Temporary Files</Text>
            <Text style={[styles.arrow, { color: colors.error }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Confirmation Modal for Clear Cache */}
        <ConfirmationModal
          visible={deleteModal}
          title="Clear Temporary Files"
          message="This will reset temporary canvas cache and non-saved drafts."
          confirmTitle="Clear Cache"
          isDestructive
          onConfirm={() => {
            setDeleteModal(false);
          }}
          onCancel={() => setDeleteModal(false)}
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
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  backBtn: {
    marginBottom: 8,
  },
  backText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 16,
    paddingLeft: 4,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii['2xl'],
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  valText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  arrow: {
    fontSize: 18,
    color: colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
});
