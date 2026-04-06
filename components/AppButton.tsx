import { ActivityIndicator, Pressable, Text } from 'react-native';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export const AppButton = ({ label, onPress, loading, variant = 'primary' }: AppButtonProps) => {
  const variantStyle =
    variant === 'primary'
      ? 'bg-brand-500'
      : variant === 'danger'
        ? 'bg-rose-500'
        : 'bg-slate-700';

  return (
    <Pressable
      disabled={loading}
      onPress={onPress}
      className={`h-12 items-center justify-center rounded-2xl ${variantStyle} ${loading ? 'opacity-70' : ''}`}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-base font-semibold text-white">{label}</Text>}
    </Pressable>
  );
};
