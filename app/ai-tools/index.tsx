import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { colors, radii, shadows } from '../../src/theme/colors';
import { SearchBar, Chip } from '../../src/components/ui/Inputs';
import { FeatureCard } from '../../src/components/ui/Cards';
import { AI_TOOLS_LIST } from '../../src/constants/aiTools';
import { ToolCategory } from '../../src/types';
import { useEditorStore } from '../../src/store/useEditorStore';

const CATEGORIES: { label: string; value: ToolCategory }[] = [
  { label: 'All Tools', value: 'all' },
  { label: 'Erase & Clean', value: 'erase' },
  { label: 'Enhance & HD', value: 'enhance' },
  { label: 'Generative AI', value: 'generative' },
  { label: 'Portraits & Face', value: 'portrait' },
  { label: 'Style & Filters', value: 'style' },
  { label: 'Adjustments', value: 'adjust' },
];

export default function AIToolsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('all');
  const setActiveTool = useEditorStore((s) => s.setActiveTool);

  const filteredTools = AI_TOOLS_LIST.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) ||
                          tool.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'all' ? true : tool.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const handleSelectTool = (toolId: string) => {
    setActiveTool(toolId);
    router.push('/editor');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={18} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>AI Tools Suite</Text>
          <Text style={styles.subtitle}>24+ Next-Gen Neural Network Image Transformers</Text>
        </View>

        {/* Search */}
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search 24+ AI models..."
        />

        {/* Category Horizontal Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat.value}
              label={cat.label}
              isSelected={activeCategory === cat.value}
              onPress={() => setActiveCategory(cat.value)}
            />
          ))}
        </ScrollView>

        {/* Tools Grid */}
        <View style={styles.grid}>
          {filteredTools.map((tool) => (
            <FeatureCard
              key={tool.id}
              title={tool.name}
              description={tool.description}
              badge={tool.badgeText}
              iconName={tool.iconName}
              isComingSoon={tool.isComingSoon}
              onPress={() => handleSelectTool(tool.id)}
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  headerRow: {
    marginBottom: 20,
  },
  backBtn: {
    marginBottom: 12,
    width: 38,
    height: 38,
    borderRadius: radii.full,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chipsScroll: {
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
