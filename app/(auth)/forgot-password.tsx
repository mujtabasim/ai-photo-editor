import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { FormInput } from '../../src/components/ui/Inputs';
import { PrimaryButton, SecondaryButton } from '../../src/components/ui/Buttons';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleReset = () => {
    setSent(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Reset Password 🔑</Text>
        <Text style={styles.subtitleText}>
          Enter your registered email address and we'll send a password recovery link.
        </Text>
      </View>

      {!sent ? (
        <View style={styles.form}>
          <FormInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="name@domain.com"
          />

          <PrimaryButton
            title="Send Reset Link"
            onPress={handleReset}
            style={{ marginTop: 12 }}
          />
        </View>
      ) : (
        <View style={styles.successBox}>
          <Text style={{ fontSize: 48, marginBottom: 12 }}>📩</Text>
          <Text style={styles.successTitle}>Check Your Inbox</Text>
          <Text style={styles.successText}>
            We've sent password reset instructions to {email || 'your email'}.
          </Text>
        </View>
      )}

      <SecondaryButton
        title="Back to Sign In"
        onPress={() => router.push('/(auth)/login')}
        style={{ marginTop: 24 }}
      />
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
    lineHeight: 22,
  },
  form: {
    width: '100%',
  },
  successBox: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
