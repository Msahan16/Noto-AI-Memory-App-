import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { TagChip } from '@/components/TagChip';
import { useNotesStore } from '@/store/notesStore';
import { formatDate } from '@/utils/format';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';

export default function NoteDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { notes, editNote, deleteNote, saving } = useNotesStore();

  const note = useMemo(() => notes.find((item) => item.id === id), [id, notes]);

  const [title, setTitle] = useState(note?.title ?? '');
  const [text, setText] = useState(note?.text ?? '');

  if (!note) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <Text className="text-base text-slate-600 dark:text-slate-300">Note not found.</Text>
      </View>
    );
  }

  const onSave = async () => {
    try {
      await editNote(note.id, {
        title: title.trim(),
        text: text.trim(),
      });
      Alert.alert('Updated', 'Note saved successfully.');
    } catch {
      Alert.alert('Update failed', 'Unable to update note now.');
    }
  };

  const onDelete = async () => {
    Alert.alert('Delete note', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteNote(note.id);
            router.replace('/(tabs)/home');
          } catch {
            Alert.alert('Delete failed', 'Unable to delete note right now.');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 px-4 pt-4 dark:bg-slate-950" contentContainerStyle={{ paddingBottom: 80 }}>
      <Text className="mb-1 text-xs uppercase tracking-wide text-slate-500">{note.category}</Text>
      <Text className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">{note.title}</Text>

      <View className="mb-3">
        <AppInput value={title} onChangeText={setTitle} placeholder="Title" />
      </View>
      <View className="mb-4">
        <AppInput value={text} onChangeText={setText} placeholder="Note text" multiline numberOfLines={8} />
      </View>

      <Text className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">AI Summary</Text>
      <Text className="mb-4 text-sm text-slate-600 dark:text-slate-300">{note.summary}</Text>

      <Text className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Tags</Text>
      <View className="mb-4 flex-row flex-wrap">
        {note.tags.length ? note.tags.map((tag) => <TagChip key={tag} tag={`#${tag}`} />) : <TagChip tag="#none" />}
      </View>

      {note.imageUrl ? <Image source={{ uri: note.imageUrl }} className="mb-4 h-52 w-full rounded-xl" resizeMode="cover" /> : null}

      <Text className="mb-4 text-xs text-slate-500">Created: {formatDate(note.createdAt)}</Text>

      <View className="mb-3">
        <AppButton label="Save changes" onPress={onSave} loading={saving} />
      </View>
      <AppButton label="Delete note" onPress={onDelete} loading={saving} variant="danger" />
    </ScrollView>
  );
}
