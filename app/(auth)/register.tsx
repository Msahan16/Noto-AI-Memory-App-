import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { useAuthStore } from '@/store/authStore';
import { Link, Redirect } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, View } from 'react-native';

export default function RegisterScreen() {
  const { user, register, loading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (user) {
    return <Redirect href="/(tabs)/home" />;
  }

  const onRegister = async () => {
    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }

    try {
      await register(email, password);
    } catch {
      Alert.alert('Sign up failed', 'Please verify your details and try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', default: undefined })}
      className="flex-1 justify-center bg-slate-50 px-5 dark:bg-slate-950"
    >
      <View className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900">
        <Text className="text-2xl font-bold text-slate-900 dark:text-white">Create account</Text>
        <Text className="mb-5 mt-1 text-sm text-slate-500">Build your AI-powered second brain.</Text>

        <View className="mb-3">
          <AppInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="Email" />
        </View>
        <View className="mb-3">
          <AppInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Password" />
        </View>

        {error ? <Text className="mb-3 text-sm text-rose-500">{error}</Text> : null}

        <AppButton label="Register" onPress={onRegister} loading={loading} />

        <Text className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
          Already have an account? <Link href="/(auth)/login" className="font-semibold text-brand-600">Log in</Link>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
