import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { PrimaryButton, SecondaryButton } from '../../src/components/ui/Buttons';
import { useAuthStore } from '../../src/store/useAuthStore';

const SLIDES = [
  {
    title: 'Transform Photos with Next-Gen AI',
    subtitle: 'Remove backgrounds, upscale 4K, erase unwanted objects, and style photos in seconds.',
    icon: '✨',
  },
  {
    title: 'Pro Editing Canvas & Layer Support',
    subtitle: 'Enjoy full control with adjustment sliders, non-destructive layer masks, and version history.',
    icon: '🎨',
  },
  {
    title: 'Generative AI Fill & Outpainting',
    subtitle: 'Expand image boundaries and generate new objects with simple text prompts.',
    icon: '🚀',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [slideIndex, setSlideIndex] = useState(0);
  const setOnboarded = useAuthStore((s) => s.setOnboarded);

  const handleNext = () => {
    if (slideIndex < SLIDES.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else {
      setOnboarded(true);
      router.replace('/(tabs)');
    }
  };

  const slide = SLIDES[slideIndex];

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.iconCircle}>
          <Text style={{ fontSize: 56 }}>{slide.icon}</Text>
        </View>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.pagination}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === slideIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        <PrimaryButton
          title={slideIndex === SLIDES.length - 1 ? 'Enter Studio' : 'Continue'}
          onPress={handleNext}
        />

        <SecondaryButton
          title="Skip"
          onPress={() => {
            setOnboarded(true);
            router.replace('/(tabs)');
          }}
          style={{ marginTop: 12 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 40,
  },
  topContainer: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  bottomContainer: {
    width: '100%',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },
});
