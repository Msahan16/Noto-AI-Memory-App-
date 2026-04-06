import { Text, View } from 'react-native';

interface EmptyStateProps {
  title: string;
  subtitle: string;
}

export const EmptyState = ({ title, subtitle }: EmptyStateProps) => {
  return (
    <View className="items-center justify-center rounded-2xl border border-dashed border-slate-300 p-8 dark:border-slate-700">
      <Text className="mb-1 text-base font-semibold text-slate-800 dark:text-slate-100">{title}</Text>
      <Text className="text-center text-sm text-slate-500">{subtitle}</Text>
    </View>
  );
};
