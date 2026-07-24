import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Platform, Alert, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { UploadCloud } from 'lucide-react-native';
import { colors, radii } from '../../src/theme/colors';
import { TopAppBar, BottomToolDock, AdjustmentsPanel } from '../../src/components/editor/EditorComponents';
import { LoadingOverlay } from '../../src/components/ui/Feedback';
import { useEditorStore } from '../../src/store/useEditorStore';
import { useHistoryStore } from '../../src/store/useHistoryStore';
import { useHaptics } from '../../src/hooks/useHaptics';
import { editorApi } from '../../src/services';
import { AdjustmentState } from '../../src/types';

const { width, height } = Dimensions.get('window');

export const buildCSSFilterString = (adj: AdjustmentState): string => {
  const brightnessFactor = (100 + adj.brightness) / 100;
  const exposureFactor = (100 + adj.exposure * 1.5) / 100;
  const totalBrightness = Math.max(0, Math.round(brightnessFactor * exposureFactor * 100));

  const contrastVal = Math.max(0, Math.round(100 + adj.contrast * 1.25));
  const saturationVal = Math.max(0, Math.round(100 + adj.saturation * 1.25 + adj.vibrance * 0.85));
  
  const tempVal = adj.temperature;
  const tintVal = adj.tint;
  const sepiaVal = tempVal > 0 ? Math.min(Math.round(tempVal * 0.8), 80) : 0;
  const hueVal = tintVal + (tempVal < 0 ? Math.round(tempVal * 0.5) : 0);

  return `brightness(${totalBrightness}%) contrast(${contrastVal}%) saturate(${saturationVal}%) hue-rotate(${hueVal}deg) sepia(${sepiaVal}%)`;
};

const generateEditedImageDataUrl = async (imageUri: string, adj: AdjustmentState): Promise<string> => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return new Promise((resolve) => {
      const filterStr = buildCSSFilterString(adj);
      const renderOnCanvas = (imgEl: HTMLImageElement): string | null => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = imgEl.naturalWidth || imgEl.width || 1920;
          canvas.height = imgEl.naturalHeight || imgEl.height || 1080;
          const ctx = canvas.getContext('2d');
          if (!ctx) return null;

          ctx.filter = filterStr;
          ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);
          // Export lossless PNG to prevent lossy JPEG darkening/color degradation
          return canvas.toDataURL('image/png');
        } catch (e) {
          console.warn('[generateEditedImageDataUrl] Render warning:', e);
          return null;
        }
      };

      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const result = renderOnCanvas(img);
        if (result) resolve(result);
        else resolve(imageUri);
      };
      img.onerror = () => {
        // Fallback without crossOrigin if CORS anonymous fails
        const imgFallback = new window.Image();
        imgFallback.onload = () => {
          const res = renderOnCanvas(imgFallback);
          resolve(res || imageUri);
        };
        imgFallback.onerror = () => resolve(imageUri);
        imgFallback.src = imageUri;
      };
      img.src = imageUri;
    });
  }
  return imageUri;
};

export default function EditorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ projectId?: string }>();
  const { lightImpact, notificationSuccess } = useHaptics();
  const { selectedImageUri, activeTool, isProcessing, setProcessing, currentProject, adjustments, setProject } = useEditorStore();
  const [activeDockTab, setActiveDockTab] = useState<'tools' | 'adjust'>('tools');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const initializeEditor = async () => {
      if (selectedImageUri) return;

      const targetId = params.projectId || currentProject?.id;
      let existingProjects = useHistoryStore.getState().projects;
      
      if (!existingProjects || existingProjects.length === 0) {
        await useHistoryStore.getState().fetchProjects();
        existingProjects = useHistoryStore.getState().projects;
      }

      let found = targetId ? existingProjects.find((p) => p.id === targetId) : null;
      if (!found && existingProjects && existingProjects.length > 0) {
        found = existingProjects[0];
      }

      if (found) {
        console.log('[EditorScreen] Restoring project:', found.id);
        setProject(found);
      }
    };

    initializeEditor();
  }, [params.projectId, selectedImageUri]);

  const saveCurrentProjectToHistory = async () => {
    if (!selectedImageUri) return null;
    const proj = useEditorStore.getState().currentProject;
    const currentTool = useEditorStore.getState().activeTool || proj?.toolUsed || 'Edited';
    const currentAdj = useEditorStore.getState().adjustments;

    // Render the final edited image (with all adjustments baked in)
    const editedImageUri = await generateEditedImageDataUrl(selectedImageUri, currentAdj);

    const updatedProject = {
      id: proj?.id || `proj_${Date.now()}`,
      title: proj?.title || 'Edited Photo',
      originalUrl: proj?.originalUrl || selectedImageUri,
      processedUrl: editedImageUri,
      thumbnailUrl: editedImageUri,
      originalImageId: proj?.originalImageId,
      toolUsed: currentTool,
      createdAt: proj?.createdAt || new Date().toISOString(),
      isFavorite: proj?.isFavorite || false,
      fileSize: proj?.fileSize || '3.4 MB',
      dimensions: proj?.dimensions || { width: 1920, height: 1080 },
    };

    useHistoryStore.getState().addProject(updatedProject);
    useEditorStore.getState().setProject(updatedProject);
    return updatedProject;
  };

  const handleManualSaveToHistory = async () => {
    if (!selectedImageUri) return;
    const updated = await saveCurrentProjectToHistory();
    if (updated) {
      notificationSuccess();
      Alert.alert('Saved to History', 'Your edited image (with all adjustments applied) has been saved to Project History.');
    }
  };

  const handleBackNavigation = async () => {
    if (selectedImageUri) {
      await saveCurrentProjectToHistory();
    }
    router.back();
  };

  const executeAITool = async (toolId: string) => {
    if (isProcessing || isExporting || !selectedImageUri) return;
    useEditorStore.getState().setActiveTool(toolId);
    lightImpact();
    setProcessing(true);
    try {
      const res = await editorApi.processAITool(toolId, selectedImageUri, {
        imageId: currentProject?.originalImageId || 'img_1',
        projectId: currentProject?.id || 'proj_1',
      });
      if (res.success && res.processedImageUrl) {
        const editedImageUri = await generateEditedImageDataUrl(res.processedImageUrl, useEditorStore.getState().adjustments);
        useEditorStore.getState().setSelectedImage(editedImageUri);
        const updatedProject = {
          id: currentProject?.id || `proj_${Date.now()}`,
          title: currentProject?.title || 'Edited Photo',
          originalUrl: currentProject?.originalUrl || selectedImageUri,
          processedUrl: editedImageUri,
          thumbnailUrl: editedImageUri,
          originalImageId: currentProject?.originalImageId,
          toolUsed: toolId,
          createdAt: currentProject?.createdAt || new Date().toISOString(),
          isFavorite: currentProject?.isFavorite || false,
        };
        useHistoryStore.getState().addProject(updatedProject);
        useHistoryStore.getState().fetchProjects();
        notificationSuccess();
      }
    } catch (e) {
      console.warn('AI process run error:', e);
    } finally {
      setProcessing(false);
    }
  };

  const handleExport = async () => {
    if (isExporting || isProcessing || !selectedImageUri) return;
    setIsExporting(true);
    try {
      const updatedProject = await saveCurrentProjectToHistory();
      const targetUri = updatedProject?.processedUrl || selectedImageUri;

      if (Platform.OS === 'web') {
        const filename = `ai-photo-editor-${Date.now()}.jpg`;
        const response = await fetch(targetUri);
        if (!response.ok) throw new Error('Failed to fetch image blob');
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);

        notificationSuccess();
        Alert.alert('Success', 'Edited image saved to history & downloaded to device successfully.');
      } else {
        const MediaLibrary = require('expo-media-library');
        const FileSystem = require('expo-file-system');

        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Media library permission is required to save photos.');
          setIsExporting(false);
          return;
        }

        let localUri = targetUri;
        if (targetUri.startsWith('http://') || targetUri.startsWith('https://')) {
          const fileUri = `${FileSystem.documentDirectory}ai-photo-editor-${Date.now()}.jpg`;
          const downloadResult = await FileSystem.downloadAsync(targetUri, fileUri);
          localUri = downloadResult.uri;
        }

        await MediaLibrary.saveToLibraryAsync(localUri);
        notificationSuccess();
        Alert.alert('Success', 'Edited image saved to history & saved to photo library successfully.');
      }
    } catch (error) {
      console.error('[handleExport] Export error:', error);
      Alert.alert('Error', 'Failed to download image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const getAdjustmentStyle = (adj: AdjustmentState) => {
    return {
      filter: buildCSSFilterString(adj),
    } as any;
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <TopAppBar
        onBack={handleBackNavigation}
        onSave={handleExport}
        onSaveHistory={handleManualSaveToHistory}
      />

      {/* Main Canvas / Image Viewport */}
      <View style={styles.viewport}>
        <View style={styles.canvasFrame}>
          {selectedImageUri ? (
            <Image
              source={{ uri: selectedImageUri }}
              style={[styles.canvasImage, getAdjustmentStyle(adjustments)]}
              resizeMode="contain"
            />
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/upload')}
              style={styles.emptyCanvasContainer}
            >
              <UploadCloud size={40} color={colors.primary} />
              <Text style={styles.emptyCanvasTitle}>No Image Loaded</Text>
              <Text style={styles.emptyCanvasSub}>Tap to import an image</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Dock Content Panel */}
      {activeDockTab === 'adjust' && <AdjustmentsPanel />}

      {/* Bottom Tool Dock */}
      <BottomToolDock
        activeTab={activeDockTab}
        onTabChange={setActiveDockTab}
        onSelectTool={(toolId) => executeAITool(toolId)}
      />

      {/* Processing / Exporting Spinner Overlay */}
      <LoadingOverlay
        visible={isProcessing || isExporting}
        message={isExporting ? 'Saving image to device...' : 'AI Processing...'}
      />
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
  emptyCanvasContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyCanvasTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  emptyCanvasSub: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
  },
});
