import { AppButton } from '@/components/AppButton';
import { useAuthStore } from '@/store/authStore';
import { useMemo } from 'react';
import { Alert, Text, View } from 'react-native';

export default function ProfileScreen() {
  const { user, logout, loading } = useAuthStore();

  const initials = useMemo(() => {
    if (!user?.email) {
      return 'NA';
    }
    return user.email.slice(0, 2).toUpperCase();
  }, [user]);

  const onLogout = async () => {
    try {
      await logout();
    } catch {
      Alert.alert('Logout failed', 'Please try again.');
    }
  };

  return (
    <View className="flex-1 bg-slate-50 px-5 pt-8 dark:bg-slate-950">
      <View className="items-center rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900">
        <View className="mb-3 h-16 w-16 items-center justify-center rounded-full bg-brand-100">
          <Text className="text-xl font-bold text-brand-700">{initials}</Text>
        </View>

        <Text className="text-lg font-semibold text-slate-900 dark:text-white">{user?.displayName || 'Noto User'}</Text>
        <Text className="mb-6 text-sm text-slate-500">{user?.email}</Text>

        <View className="w-full">
          <AppButton label="Logout" onPress={onLogout} loading={loading} variant="danger" />
        </View>
      </View>
    </View>
  );
}
