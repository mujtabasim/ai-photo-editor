import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, radii, shadows } from '../../theme/colors';
import { useEditorStore } from '../../store/useEditorStore';
import { useHaptics } from '../../hooks/useHaptics';
import { AI_TOOLS_LIST } from '../../constants/aiTools';

export const TopAppBar: React.FC<{
  onBack: () => void;
  onSave: () => void;
}> = ({ onBack, onSave }) => {
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
        <Text style={styles.btnIcon}>←</Text>
      </TouchableOpacity>

      <View style={styles.undoRedoGroup}>
        <TouchableOpacity
          disabled={!canUndo}
          onPress={() => { lightImpact(); undo(); }}
          style={[styles.smallBtn, !canUndo && styles.btnDisabled]}
        >
          <Text style={styles.btnIcon}>↩</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!canRedo}
          onPress={() => { lightImpact(); redo(); }}
          style={[styles.smallBtn, !canRedo && styles.btnDisabled]}
        >
          <Text style={styles.btnIcon}>↪</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => { mediumImpact(); onSave(); }}
        style={styles.saveBtn}
      >
        <Text style={styles.saveBtnText}>Export</Text>
      </TouchableOpacity>
    </View>
  );
};

export const BottomToolDock: React.FC<{
  activeTab: 'tools' | 'adjust' | 'layers' | 'history';
  onTabChange: (tab: 'tools' | 'adjust' | 'layers' | 'history') => void;
  onSelectTool: (toolId: string) => void;
}> = ({ activeTab, onTabChange, onSelectTool }) => {
  const { activeTool } = useEditorStore();
  const { selection } = useHaptics();

  return (
    <View style={[styles.dockContainer, shadows.lg]}>
      {/* Dock Category Selector */}
      <View style={styles.categoryBar}>
        <TouchableOpacity
          onPress={() => { selection(); onTabChange('tools'); }}
          style={[styles.catTab, activeTab === 'tools' && styles.catTabActive]}
        >
          <Text style={[styles.catText, activeTab === 'tools' && styles.catTextActive]}>AI Tools</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { selection(); onTabChange('adjust'); }}
          style={[styles.catTab, activeTab === 'adjust' && styles.catTabActive]}
        >
          <Text style={[styles.catText, activeTab === 'adjust' && styles.catTextActive]}>Adjust</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { selection(); onTabChange('layers'); }}
          style={[styles.catTab, activeTab === 'layers' && styles.catTabActive]}
        >
          <Text style={[styles.catText, activeTab === 'layers' && styles.catTextActive]}>Layers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { selection(); onTabChange('history'); }}
          style={[styles.catTab, activeTab === 'history' && styles.catTabActive]}
        >
          <Text style={[styles.catText, activeTab === 'history' && styles.catTextActive]}>Timeline</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Tool Scroll */}
      {activeTab === 'tools' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolScroll}>
          {AI_TOOLS_LIST.slice(0, 10).map((tool) => {
            const isSelected = activeTool === tool.id;
            return (
              <TouchableOpacity
                key={tool.id}
                onPress={() => { selection(); onSelectTool(tool.id); }}
                style={[styles.toolCard, isSelected && styles.toolCardSelected]}
              >
                <View style={styles.toolIconCircle}>
                  <Text style={{ fontSize: 18 }}>✨</Text>
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
            <View key={ctrl.key} style={styles.sliderBox}>
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

export const LayersPanel: React.FC = () => {
  const { layers, toggleLayerVisibility, toggleLayerLock } = useEditorStore();
  const { lightImpact } = useHaptics();

  return (
    <View style={styles.layersContainer}>
      {layers.map((layer) => (
        <View key={layer.id} style={styles.layerRow}>
          <TouchableOpacity onPress={() => { lightImpact(); toggleLayerVisibility(layer.id); }}>
            <Text style={styles.layerAction}>{layer.isVisible ? '👁️' : '🙈'}</Text>
          </TouchableOpacity>
          <Text style={styles.layerTitle}>{layer.name}</Text>
          <TouchableOpacity onPress={() => { lightImpact(); toggleLayerLock(layer.id); }}>
            <Text style={styles.layerAction}>{layer.isLocked ? '🔒' : '🔓'}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export const HistoryTimeline: React.FC = () => {
  const { history, historyIndex } = useEditorStore();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
      {history.map((step, idx) => {
        const isCurrent = idx === historyIndex;
        return (
          <View key={step.timestamp} style={[styles.historyNode, isCurrent && styles.historyNodeActive]}>
            <Text style={[styles.historyText, isCurrent && styles.historyTextActive]}>
              Step {idx + 1}: {step.action}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  topAppBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnIcon: {
    fontSize: 18,
    color: colors.textPrimary,
  },
  undoRedoGroup: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: radii.full,
    padding: 3,
  },
  smallBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: {
    opacity: 0.3,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: radii.full,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  dockContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: radii['2xl'],
    borderTopRightRadius: radii['2xl'],
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: colors.borderLight,
  },
  categoryBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  catTab: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: radii.full,
  },
  catTabActive: {
    backgroundColor: '#EEF2FF',
  },
  catText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  catTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  toolScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  toolCard: {
    width: 80,
    alignItems: 'center',
    padding: 10,
    borderRadius: radii.xl,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  toolCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#EEF2FF',
  },
  toolIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  toolName: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  toolNameSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  adjustPanel: {
    paddingVertical: 8,
  },
  sliderBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: radii.xl,
    padding: 12,
    alignItems: 'center',
    width: 120,
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
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  stepVal: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  layersContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  layerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: radii.lg,
  },
  layerAction: {
    fontSize: 16,
  },
  layerTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  historyNode: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.lg,
  },
  historyNodeActive: {
    backgroundColor: colors.primary,
  },
  historyText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  historyTextActive: {
    color: '#FFFFFF',
  },
});
