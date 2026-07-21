import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { FormInput } from '../../src/components/ui/Inputs';
import { PrimaryButton } from '../../src/components/ui/Buttons';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex.rivera@example.com');
  const [password, setPassword] = useState('password123');
  const { register, isLoading } = useAuthStore();

  const handleRegister = async () => {
    await register(name, email);
    router.replace('/(tabs)');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Create Account 🚀</Text>
        <Text style={styles.subtitleText}>Join thousands creating stunning photos with AI</Text>
      </View>

      <View style={styles.form}>
        <FormInput
          label="Full Name"
          value={name}
          onChangeText={setName}
          placeholder="Alex Rivera"
        />

        <FormInput
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="name@domain.com"
        />

        <FormInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="At least 8 characters"
          secureTextEntry
        />

        <PrimaryButton
          title="Create Account"
          onPress={handleRegister}
          isLoading={isLoading}
          style={{ marginTop: 16 }}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.signupText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  form: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  signupText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
});
