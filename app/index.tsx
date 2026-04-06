import { LoadingOverlay } from '@/components/LoadingOverlay';
import { useAuthStore } from '@/store/authStore';
import { Redirect } from 'expo-router';

export default function Index() {
  const { user, initializing } = useAuthStore();

  if (initializing) {
    return <LoadingOverlay label="Preparing your workspace" />;
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
