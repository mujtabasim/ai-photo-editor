import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft, Undo2, Redo2, Download, Sliders, Sparkles, Save } from 'lucide-react-native';
import { colors, radii, shadows } from '../../theme/colors';
import { useEditorStore } from '../../store/useEditorStore';
import { useHaptics } from '../../hooks/useHaptics';
import { AI_TOOLS_LIST } from '../../constants/aiTools';
import { getLucideIcon } from '../ui/Cards';

export const TopAppBar: React.FC<{
  onBack: () => void;
  onSave: () => void;
  onSaveHistory: () => void;
}> = ({ onBack, onSave, onSaveHistory }) => {
  const { undo, redo, historyIndex, history } = useEditorStore();
  const { lightImpact, mediumImpact } = useHaptics();

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <View style={styles.topAppBar}>
      <TouchableOpacity
        onPress={() => { lightImpact(); onBack(); }}
        style={styles.circleBtn}
      >
        <ArrowLeft size={18} color={colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.undoRedoGroup}>
        <TouchableOpacity
          disabled={!canUndo}
          onPress={() => { lightImpact(); undo(); }}
          style={[styles.smallBtn, !canUndo && styles.btnDisabled]}
        >
          <Undo2 size={16} color={canUndo ? colors.textPrimary : colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!canRedo}
          onPress={() => { lightImpact(); redo(); }}
          style={[styles.smallBtn, !canRedo && styles.btnDisabled]}
        >
          <Redo2 size={16} color={canRedo ? colors.textPrimary : colors.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => { lightImpact(); onSaveHistory(); }}
          style={styles.historyBtn}
        >
          <Save size={15} color={colors.primary} />
          <Text style={styles.historyBtnText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => { mediumImpact(); onSave(); }}
          style={styles.saveBtn}
        >
          <Download size={15} color="#FFFFFF" />
          <Text style={styles.saveBtnText}>Export</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const BottomToolDock: React.FC<{
  activeTab: 'tools' | 'adjust';
  onTabChange: (tab: 'tools' | 'adjust') => void;
  onSelectTool: (toolId: string) => void;
}> = ({ activeTab, onTabChange, onSelectTool }) => {
  const { activeTool } = useEditorStore();
  const { selection } = useHaptics();

  return (
    <View style={[styles.dockContainer, shadows.lg]}>
      {/* Dock Category Selector: AI Tools & Adjust only */}
      <View style={styles.categoryBar}>
        <TouchableOpacity
          onPress={() => { selection(); onTabChange('tools'); }}
          style={[styles.catTab, activeTab === 'tools' && styles.catTabActive]}
        >
          <Sparkles size={14} color={activeTab === 'tools' ? '#FFFFFF' : colors.textSecondary} />
          <Text style={[styles.catText, activeTab === 'tools' && styles.catTextActive]}>AI Tools</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { selection(); onTabChange('adjust'); }}
          style={[styles.catTab, activeTab === 'adjust' && styles.catTabActive]}
        >
          <Sliders size={14} color={activeTab === 'adjust' ? '#FFFFFF' : colors.textSecondary} />
          <Text style={[styles.catText, activeTab === 'adjust' && styles.catTextActive]}>Adjust</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Tool Scroll */}
      {activeTab === 'tools' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolScroll}>
          {AI_TOOLS_LIST.slice(0, 10).map((tool) => {
            const isSelected = activeTool === tool.id;
            const iconColor = isSelected ? '#FFFFFF' : colors.textSecondary;
            return (
              <TouchableOpacity
                key={tool.id}
                onPress={() => { selection(); onSelectTool(tool.id); }}
                style={[
                  styles.toolCard,
                  shadows.sm,
                  isSelected ? styles.toolCardSelected : styles.toolCardInactive
                ]}
                activeOpacity={0.85}
              >
                <View style={[styles.toolIconCircle, isSelected && styles.toolIconCircleSelected]}>
                  {getLucideIcon(tool.iconName, 18, iconColor)}
                </View>
                <Text style={[styles.toolName, isSelected && styles.toolNameSelected]} numberOfLines={1}>
                  {tool.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

export const AdjustmentsPanel: React.FC = () => {
  const { adjustments, updateAdjustment } = useEditorStore();
  const { lightImpact } = useHaptics();

  const controls = [
    { key: 'brightness', label: 'Brightness' },
    { key: 'contrast', label: 'Contrast' },
    { key: 'saturation', label: 'Saturation' },
    { key: 'sharpness', label: 'Sharpness' },
    { key: 'exposure', label: 'Exposure' },
    { key: 'vibrance', label: 'Vibrance' },
  ] as const;

  return (
    <View style={styles.adjustPanel}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}>
        {controls.map((ctrl) => {
          const val = adjustments[ctrl.key];
          return (
            <View key={ctrl.key} style={[styles.sliderBox, shadows.sm]}>
              <Text style={styles.sliderLabel}>{ctrl.label}</Text>
              <View style={styles.stepperRow}>
                <TouchableOpacity
                  onPress={() => { lightImpact(); updateAdjustment(ctrl.key, val - 5); }}
                  style={styles.stepBtn}
                >
                  <Text style={styles.stepBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.stepVal}>{val}</Text>
                <TouchableOpacity
                  onPress={() => { lightImpact(); updateAdjustment(ctrl.key, val + 5); }}
                  style={styles.stepBtn}
                >
                  <Text style={styles.stepBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  topAppBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: radii.full,
    backgroundColor: '#F4F4F8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  undoRedoGroup: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: '#F4F4F8',
    borderRadius: radii.full,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  smallBtn: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: {
    opacity: 0.3,
  },
  historyBtn: {
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyBtnText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    ...shadows.sm,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  dockContainer: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radii['2xl'],
    borderTopRightRadius: radii['2xl'],
    paddingTop: 14,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  categoryBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  catTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: radii.full,
  },
  catTabActive: {
    backgroundColor: colors.primary,
  },
  catText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  catTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  toolScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  toolCard: {
    width: 90,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: radii.xl,
    borderWidth: 1,
  },
  toolCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  toolCardInactive: {
    backgroundColor: colors.card,
    borderColor: colors.border,
  },
  toolIconCircle: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: '#F4F4F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  toolIconCircleSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  toolName: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  toolNameSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  adjustPanel: {
    paddingVertical: 8,
  },
  sliderBox: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: 12,
    alignItems: 'center',
    width: 124,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sliderLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: radii.full,
    backgroundColor: '#F4F4F8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  stepVal: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
});
