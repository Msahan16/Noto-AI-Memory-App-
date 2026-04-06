import { ActivityIndicator, Text, View } from 'react-native';

interface LoadingOverlayProps {
  label?: string;
}

export const LoadingOverlay = ({ label = 'Loading...' }: LoadingOverlayProps) => {
  return (
    <View className="absolute bottom-0 left-0 right-0 top-0 z-50 items-center justify-center bg-black/25">
      <View className="rounded-2xl bg-white px-5 py-4 dark:bg-slate-800">
        <ActivityIndicator size="large" color="#1373C9" />
        <Text className="mt-2 text-sm text-slate-700 dark:text-slate-200">{label}</Text>
      </View>
    </View>
  );
};
