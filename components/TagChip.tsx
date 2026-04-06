import { Pressable, Text } from 'react-native';

interface TagChipProps {
  tag: string;
  active?: boolean;
  onPress?: () => void;
}

export const TagChip = ({ tag, active, onPress }: TagChipProps) => {
  return (
    <Pressable
      onPress={onPress}
      className={`mr-2 rounded-full px-3 py-1 ${active ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-700'}`}
    >
      <Text className={`text-xs font-medium ${active ? 'text-white' : 'text-slate-700 dark:text-slate-100'}`}>{tag}</Text>
    </Pressable>
  );
};
