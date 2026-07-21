import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, radii, shadows } from '../../src/theme/colors';
import { SearchBar } from '../../src/components/ui/Inputs';
import { EmptyState, ConfirmationModal } from '../../src/components/ui/Feedback';
import { useHistoryStore } from '../../src/store/useHistoryStore';
import { useEditorStore } from '../../src/store/useEditorStore';
import { ProjectHistory } from '../../src/types';
import { useHaptics } from '../../src/hooks/useHaptics';

export default function HistoryScreen() {
  const router = useRouter();
  const { lightImpact } = useHaptics();
  const { projects, searchQuery, setSearchQuery, toggleFavorite, deleteProject, filterFavoriteOnly, setFilterFavoriteOnly } = useHistoryStore();
  const setProject = useEditorStore((s) => s.setProject);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.toolUsed.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFav = filterFavoriteOnly ? p.isFavorite : true;
    return matchesSearch && matchesFav;
  });

  const handleOpenProject = (project: ProjectHistory) => {
    lightImpact();
    setProject(project);
    router.push('/editor');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Project History</Text>
        <Text style={styles.subtitle}>{projects.length} AI Photo Projects</Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Filter history..."
      />

      <View style={styles.filterRow}>
        <TouchableOpacity
          onPress={() => setFilterFavoriteOnly(false)}
          style={[styles.filterChip, !filterFavoriteOnly && styles.filterChipActive]}
        >
          <Text style={[styles.filterText, !filterFavoriteOnly && styles.filterTextActive]}>All Projects</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFilterFavoriteOnly(true)}
          style={[styles.filterChip, filterFavoriteOnly && styles.filterChipActive]}
        >
          <Text style={[styles.filterText, filterFavoriteOnly && styles.filterTextActive]}>⭐ Favorites</Text>
        </TouchableOpacity>
      </View>

      {filteredProjects.length === 0 ? (
        <EmptyState
          title="No Projects Found"
          description="You haven't created any projects matching this filter yet."
          actionTitle="Create New Project"
          onAction={() => router.push('/upload')}
        />
      ) : (
        <FlatList
          data={filteredProjects}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handleOpenProject(item)}
              style={[styles.card, shadows.sm]}
            >
              <Image source={{ uri: item.thumbnailUrl }} style={styles.thumb} />
              
              <View style={styles.infoCol}>
                <View style={styles.titleRow}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                  <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                    <Text style={{ fontSize: 16 }}>{item.isFavorite ? '⭐' : '☆'}</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.toolBadge}>{item.toolUsed}</Text>
                
                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>{item.createdAt}</Text>
                  <Text style={styles.metaDot}>•</Text>
                  <Text style={styles.metaText}>{item.fileSize}</Text>
                </View>

                {/* Card Actions */}
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    onPress={() => handleOpenProject(item)}
                    style={styles.actionBtn}
                  >
                    <Text style={styles.actionText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setDeleteId(item.id)}
                    style={styles.actionBtnDelete}
                  >
                    <Text style={styles.actionDeleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={!!deleteId}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmTitle="Delete"
        isDestructive
        onConfirm={() => {
          if (deleteId) deleteProject(deleteId);
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.full,
    backgroundColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 110,
    gap: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii['2xl'],
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  thumb: {
    width: 96,
    height: 96,
    borderRadius: radii.xl,
  },
  infoCol: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  toolBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  metaDot: {
    fontSize: 11,
    color: colors.textMuted,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  actionBtn: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: radii.md,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  actionBtnDelete: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionDeleteText: {
    fontSize: 12,
    color: colors.error,
    fontWeight: '600',
  },
});
