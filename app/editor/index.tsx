import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, radii, shadows } from '../../src/theme/colors';
import { TopAppBar, BottomToolDock, AdjustmentsPanel, LayersPanel, HistoryTimeline } from '../../src/components/editor/EditorComponents';
import { PrimaryButton } from '../../src/components/ui/Buttons';
import { LoadingOverlay } from '../../src/components/ui/Feedback';
import { useEditorStore } from '../../src/store/useEditorStore';
import { useHaptics } from '../../src/hooks/useHaptics';
import { editorApi } from '../../src/services';

const { width, height } = Dimensions.get('window');

export default function EditorScreen() {
  const router = useRouter();
  const { lightImpact, notificationSuccess } = useHaptics();
  const { selectedImageUri, activeTool, isProcessing, setProcessing, currentProject } = useEditorStore();

  const [activeDockTab, setActiveDockTab] = useState<'tools' | 'adjust' | 'layers' | 'history'>('tools');
  const [exportModal, setExportModal] = useState(false);

  const handleRunAI = async () => {
    if (!activeTool || !selectedImageUri) return;
    lightImpact();
    setProcessing(true);
    try {
      const res = await editorApi.processAITool(activeTool, selectedImageUri, {
        imageId: currentProject?.originalImageId || 'img_mock_1',
        projectId: currentProject?.id || 'proj_mock_1',
      });
      if (res.success && res.processedImageUrl) {
        useEditorStore.getState().setSelectedImage(res.processedImageUrl);
        notificationSuccess();
      }
    } catch (e) {
      console.warn('AI process run error:', e);
    } finally {
      setProcessing(false);
    }
  };

  const imageSource = selectedImageUri || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200';

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <TopAppBar
        onBack={() => router.back()}
        onSave={() => setExportModal(true)}
      />

      {/* Main Canvas / Image Viewport with Zoom/Pan Placeholder */}
      <View style={styles.viewport}>
        <View style={styles.canvasFrame}>
          <Image source={{ uri: imageSource }} style={styles.canvasImage} resizeMode="contain" />
          
          {/* Active AI Overlay Indicator */}
          {activeTool && (
            <View style={styles.toolOverlayBadge}>
              <Text style={styles.toolOverlayText}>✨ {activeTool.toUpperCase()}</Text>
            </View>
          )}

          {/* Zoom/Pan Gesture Hint */}
          <View style={styles.gestureHint}>
            <Text style={styles.hintText}>Pinch to zoom • Drag to pan canvas</Text>
          </View>
        </View>

        {/* Floating AI Render CTA */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handleRunAI}
          style={[styles.aiFloatingBtn, shadows.glow]}
        >
          <Text style={styles.aiFloatingText}>⚡ Run AI Render</Text>
        </TouchableOpacity>
      </View>

      {/* Dock Content Panel */}
      {activeDockTab === 'adjust' && <AdjustmentsPanel />}
      {activeDockTab === 'layers' && <LayersPanel />}
      {activeDockTab === 'history' && <HistoryTimeline />}

      {/* Bottom Tool Dock */}
      <BottomToolDock
        activeTab={activeDockTab}
        onTabChange={setActiveDockTab}
        onSelectTool={(toolId) => useEditorStore.getState().setActiveTool(toolId)}
      />

      {/* Processing Spinner Overlay */}
      <LoadingOverlay visible={isProcessing} message="AI Neural Model Rendering 4K Canvas..." />

      {/* Export Success Modal */}
      {exportModal && (
        <View style={styles.exportOverlay}>
          <View style={[styles.exportCard, shadows.lg]}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🎉</Text>
            <Text style={styles.exportTitle}>Image Exported in 4K!</Text>
            <Text style={styles.exportSub}>Saved to Camera Roll and AI Cloud History.</Text>
            <PrimaryButton
              title="Done"
              onPress={() => {
                setExportModal(false);
                router.back();
              }}
              style={{ width: '100%', marginTop: 16 }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  viewport: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  canvasFrame: {
    width: width * 0.9,
    height: height * 0.55,
    borderRadius: radii['2xl'],
    overflow: 'hidden',
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  canvasImage: {
    width: '100%',
    height: '100%',
  },
  toolOverlayBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(91, 95, 239, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
  },
  toolOverlayText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  gestureHint: {
    position: 'absolute',
    bottom: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.full,
  },
  hintText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: '600',
  },
  aiFloatingBtn: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: radii.full,
  },
  aiFloatingText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  exportOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 2000,
  },
  exportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii['2xl'],
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  exportTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  exportSub: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
});
