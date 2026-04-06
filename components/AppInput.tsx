import { TextInput, TextInputProps, View } from 'react-native';

interface AppInputProps extends TextInputProps {
  multiline?: boolean;
}

export const AppInput = ({ multiline, ...props }: AppInputProps) => {
  return (
    <View className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
      <TextInput
        className="text-base text-slate-900 dark:text-slate-100"
        placeholderTextColor="#94A3B8"
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        {...props}
      />
    </View>
  );
};
