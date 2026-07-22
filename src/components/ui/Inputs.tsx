import React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, radii } from '../../theme/colors';
import { useHaptics } from '../../hooks/useHaptics';

export const SearchBar: React.FC<{
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}> = ({ value, onChangeText, placeholder = 'Search AI tools, styles, or projects...', onClear }) => {
  return (
    <View style={styles.searchContainer}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear || (() => onChangeText(''))}>
          <Text style={styles.clearIcon}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export const FormInput: React.FC<{
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
}> = ({ label, value, onChangeText, placeholder, secureTextEntry, error }) => {
  return (
    <View style={styles.formContainer}>
      <Text style={styles.formLabel}>{label}</Text>
      <TextInput
        style={error ? [styles.formInput, styles.inputError] : styles.formInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        secureTextEntry={secureTextEntry}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export const SegmentedControl: React.FC<{
  options: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}> = ({ options, selectedIndex, onSelect }) => {
  const { selection } = useHaptics();

  return (
    <View style={styles.segmentedContainer}>
      {options.map((opt, i) => {
        const isSelected = i === selectedIndex;
        return (
          <TouchableOpacity
            key={opt}
            activeOpacity={0.8}
            onPress={() => {
              selection();
              onSelect(i);
            }}
            style={[styles.segmentBtn, isSelected && styles.segmentBtnSelected]}
          >
            <Text style={[styles.segmentText, isSelected && styles.segmentTextSelected]}>
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const Chip: React.FC<{
  label: string;
  isSelected?: boolean;
  onPress: () => void;
}> = ({ label, isSelected, onPress }) => {
  const { lightImpact } = useHaptics();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        lightImpact();
        onPress();
      }}
      style={[styles.chip, isSelected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: '#F1F5F9',
    borderRadius: radii.xl,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  clearIcon: {
    color: colors.textMuted,
    fontSize: 14,
    padding: 4,
  },
  formContainer: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 15,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  segmentedContainer: {
    backgroundColor: '#F1F5F9',
    borderRadius: radii.xl,
    padding: 4,
    flexDirection: 'row',
    marginBottom: 16,
  },
  segmentBtn: {
    flex: 1,
    height: 38,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnSelected: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  segmentTextSelected: {
    color: colors.textPrimary,
  },
  chip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.full,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
});
